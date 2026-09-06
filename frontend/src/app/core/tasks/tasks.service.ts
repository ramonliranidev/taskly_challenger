import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Observable, Subject, debounceTime, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ProjectsService } from '../projects/projects.service';
import { TASK_STATUS_ORDER } from './task-status';
import { Attachment, Task, TaskStatus, UpdateTaskPayload } from './task.models';

export type TaskViewMode = 'list' | 'kanban';

/**
 * Tarefas do projeto ativo (ver `ProjectsService`), visão Lista/Kanban e o
 * painel de edição sobreposto. Um `effect()` observa `activeProjectId` e
 * centraliza aqui a regra "trocar de projeto recarrega as tarefas e fecha o
 * painel" — nenhum componente precisa lidar com isso.
 *
 * Auto-save do painel: campos de texto/prazo usam debounce por acumulador
 * (grava local na hora, só dispara o PATCH depois de ~500ms de silêncio —
 * um `debounceTime` ingênuo sobre um Subject de patches perderia edições de
 * campos diferentes dentro da mesma janela). Situação/tags/anexos/exclusão
 * são imediatos, sempre dando flush do que estiver pendente antes.
 */
@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly projects = inject(ProjectsService);
  private readonly api = environment.apiUrl;

  private readonly _tasks = signal<Task[]>([]);
  private readonly _viewMode = signal<TaskViewMode>('list');
  private readonly _openTaskId = signal<number | null>(null);

  readonly tasks = this._tasks.asReadonly();
  readonly viewMode = this._viewMode.asReadonly();
  readonly openTaskId = this._openTaskId.asReadonly();

  readonly openTask = computed(
    () => this._tasks().find((t) => t.id === this._openTaskId()) ?? null,
  );

  /** Colunas do Kanban, na ordem fixa do design (README §4). */
  readonly byStatus = computed(() => {
    const tasks = this._tasks();
    return TASK_STATUS_ORDER.map((status) => ({
      status,
      tasks: tasks.filter((t) => t.status === status),
    }));
  });

  /** Rodapé da sidebar: "concluídas / total" do projeto ativo. */
  readonly counts = computed(() => {
    const tasks = this._tasks();
    return { done: tasks.filter((t) => t.status === 'done').length, total: tasks.length };
  });

  private pendingTaskId: number | null = null;
  private pendingPatch: UpdateTaskPayload = {};
  private readonly flush$ = new Subject<void>();

  constructor() {
    this.flush$.pipe(debounceTime(500)).subscribe(() => this.flushPending());

    effect(() => {
      const projectId = this.projects.activeProjectId();
      this.flushPending();
      this._openTaskId.set(null);

      if (projectId === null) {
        this._tasks.set([]);
        return;
      }
      // error: () => void 0 — fire-and-forget, mesmo padrão do
      // AuthService.logout(). Uma reexecução deste efeito bem no momento
      // do logout/troca de rota pode chegar a disparar esta chamada com o
      // token já limpo (401); não há nada a fazer além de ignorar.
      this.loadForProject(projectId).subscribe({ error: () => void 0 });
    });
  }

  setViewMode(mode: TaskViewMode): void {
    this._viewMode.set(mode);
  }

  openTaskPanel(id: number): void {
    this._openTaskId.set(id);
  }

  closeTaskPanel(): void {
    this.flushPending();
    this._openTaskId.set(null);
  }

  loadForProject(projectId: number): Observable<Task[]> {
    return this.http.get<{ tasks: Task[] }>(`${this.api}/projects/${projectId}/tasks`).pipe(
      map((res) => res.tasks),
      tap((tasks) => this._tasks.set(tasks)),
    );
  }

  /** Cria "Nova tarefa" (sem tags/anexos, situação padrão) e já abre o painel nela. */
  create(projectId: number): Observable<Task> {
    return this.http
      .post<{ task: Task }>(`${this.api}/projects/${projectId}/tasks`, { title: 'Nova tarefa' })
      .pipe(
        map((res) => res.task),
        tap((task) => {
          this._tasks.update((tasks) => [...tasks, task]);
          this.openTaskPanel(task.id);
        }),
      );
  }

  updateFields(taskId: number, patch: UpdateTaskPayload): void {
    this.patchLocal(taskId, patch);
    if (this.pendingTaskId !== null && this.pendingTaskId !== taskId) {
      this.flushPending();
    }
    this.pendingTaskId = taskId;
    this.pendingPatch = { ...this.pendingPatch, ...patch };
    this.flush$.next();
  }

  /**
   * Muda a situação da tarefa via o mesmo PATCH do painel de edição. UI
   * otimista: grava local na hora e, se o request falhar, volta a situação
   * anterior (o card do Kanban some da coluna de destino e reaparece na de
   * origem sozinho, porque `byStatus()` deriva de `_tasks`).
   */
  updateStatus(taskId: number, status: TaskStatus): void {
    const previous = this._tasks().find((t) => t.id === taskId)?.status;
    if (previous === undefined || previous === status) {
      return;
    }
    this.flushPending();
    this.patchLocal(taskId, { status });
    this.sendPatch(taskId, { status }).subscribe({
      error: () => this.patchLocal(taskId, { status: previous }),
    });
  }

  addTag(taskId: number, name: string): void {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    this.flushPending();
    const current = this._tasks().find((t) => t.id === taskId)?.tags ?? [];
    if (current.includes(trimmed)) {
      return;
    }
    const tags = [...current, trimmed];
    this.patchLocal(taskId, { tags });
    this.sendPatch(taskId, { tags }).subscribe();
  }

  removeTag(taskId: number, name: string): void {
    this.flushPending();
    const tags = (this._tasks().find((t) => t.id === taskId)?.tags ?? []).filter((t) => t !== name);
    this.patchLocal(taskId, { tags });
    this.sendPatch(taskId, { tags }).subscribe();
  }

  /** Upload imediato — a miniatura da resposta já traz a `url` pronta, sem
   * precisar de preview local via FileReader/blob. */
  uploadAttachments(taskId: number, files: FileList): void {
    const form = new FormData();
    Array.from(files).forEach((file) => form.append('files[]', file));

    this.http
      .post<{ attachments: Attachment[] }>(`${this.api}/tasks/${taskId}/attachments`, form)
      .subscribe((res) => {
        this._tasks.update((tasks) =>
          tasks.map((t) =>
            t.id === taskId ? { ...t, attachments: [...t.attachments, ...res.attachments] } : t,
          ),
        );
      });
  }

  removeAttachment(taskId: number, attachmentId: number): void {
    this.http.delete(`${this.api}/attachments/${attachmentId}`).subscribe(() => {
      this._tasks.update((tasks) =>
        tasks.map((t) =>
          t.id === taskId
            ? { ...t, attachments: t.attachments.filter((a) => a.id !== attachmentId) }
            : t,
        ),
      );
    });
  }

  delete(taskId: number): void {
    this.http.delete(`${this.api}/tasks/${taskId}`).subscribe(() => {
      this._tasks.update((tasks) => tasks.filter((t) => t.id !== taskId));
      if (this._openTaskId() === taskId) {
        this._openTaskId.set(null);
      }
    });
  }

  private flushPending(): void {
    if (this.pendingTaskId === null || Object.keys(this.pendingPatch).length === 0) {
      return;
    }
    const taskId = this.pendingTaskId;
    const patch = this.pendingPatch;
    this.pendingTaskId = null;
    this.pendingPatch = {};
    this.sendPatch(taskId, patch).subscribe();
  }

  private sendPatch(taskId: number, patch: UpdateTaskPayload): Observable<Task> {
    return this.http.patch<{ task: Task }>(`${this.api}/tasks/${taskId}`, patch).pipe(
      map((res) => res.task),
      tap((task) => this.replaceLocal(task)),
    );
  }

  private patchLocal(taskId: number, patch: UpdateTaskPayload): void {
    this._tasks.update((tasks) => tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)));
  }

  private replaceLocal(task: Task): void {
    this._tasks.update((tasks) => tasks.map((t) => (t.id === task.id ? task : t)));
  }
}
