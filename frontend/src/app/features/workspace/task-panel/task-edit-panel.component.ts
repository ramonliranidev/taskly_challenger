import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { TagsService } from '../../../core/tags/tags.service';
import { Task } from '../../../core/tasks/task.models';
import { TasksService } from '../../../core/tasks/tasks.service';
import { AttachmentListComponent } from '../../../shared/ui/attachment-list/attachment-list.component';
import { PromptDialogComponent } from '../../../shared/ui/dialog/prompt-dialog.component';
import { combineDateTime, splitIsoDateTime } from '../../../shared/utils/format';
import { TaskStatusSelectComponent } from './task-status-select.component';

/** Cada campo salva sozinho via `TasksService`; "Salvar alterações" só fecha
 * o painel. "Excluir" pede confirmação antes de apagar. */
@Component({
  selector: 'app-task-edit-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskStatusSelectComponent, AttachmentListComponent, PromptDialogComponent],
  template: `
    <aside
      class="fixed inset-y-0 right-0 z-20 flex w-[min(400px,92vw)] flex-col overflow-hidden border-l-2 border-ink bg-bg shadow-lg"
    >
      <div
        class="flex min-h-[52px] shrink-0 items-center justify-between gap-3 border-b-2 border-ink px-5"
      >
        <span class="text-[11px] tracking-[0.18em] text-muted uppercase">Editar tarefa</span>
        <button
          type="button"
          class="text-[11px] font-extrabold tracking-[0.14em] text-accent-700 uppercase"
          (click)="close()"
        >
          Fechar
        </button>
      </div>

      <div class="flex min-h-0 flex-1 flex-col gap-[22px] overflow-y-auto px-5 py-6">
        <div class="flex flex-col gap-1.5">
          <label class="field-label" for="task-title">Título</label>
          <input
            id="task-title"
            class="field-input min-h-[44px] text-[16px] font-semibold"
            [value]="task().title"
            (change)="onTitleChange($any($event.target).value)"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="field-label" for="task-desc">Descrição curta</label>
          <input
            id="task-desc"
            class="field-input min-h-[44px] text-[14px]"
            [value]="task().short_description ?? ''"
            (change)="onShortDescriptionChange($any($event.target).value)"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="field-label" for="task-full">Descrição completa</label>
          <textarea
            id="task-full"
            rows="5"
            class="field-input resize-y text-[14px] leading-[1.5]"
            [value]="task().full_description ?? ''"
            (change)="onFullDescriptionChange($any($event.target).value)"
          ></textarea>
        </div>

        <div class="grid grid-cols-[1fr_120px] gap-3">
          <div class="flex flex-col gap-1.5">
            <label class="field-label" for="task-date">Prazo — data</label>
            <input
              id="task-date"
              type="date"
              class="field-input min-h-[44px] text-[14px]"
              [value]="dueDate().date"
              (change)="onDateChange($any($event.target).value, dueDate().time)"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="field-label" for="task-time">Hora</label>
            <input
              id="task-time"
              type="time"
              class="field-input min-h-[44px] text-[14px]"
              [value]="dueDate().time"
              (change)="onDateChange(dueDate().date, $any($event.target).value)"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="field-label">Situação</span>
          <app-task-status-select
            [status]="task().status"
            (statusChange)="tasks.updateStatus(task().id, $event)"
          />
        </div>

        <div class="flex flex-col gap-2">
          <span class="field-label">Tags</span>
          <div class="flex flex-wrap gap-2">
            @for (tag of task().tags; track tag) {
              <span
                class="inline-flex items-center gap-2 border-2 border-ink px-2 py-[5px] text-[11px] tracking-[0.12em] uppercase"
              >
                {{ tag }}
                <button
                  type="button"
                  class="text-[12px] leading-none text-accent-700"
                  (click)="tasks.removeTag(task().id, tag)"
                >
                  ×
                </button>
              </span>
            }
            <button
              type="button"
              class="border-2 border-dashed border-ink/40 px-2 py-[5px] text-[11px] tracking-[0.12em] text-accent-700 uppercase"
              (click)="openTagDialog()"
            >
              + Tag
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="field-label">Anexos e fotos</span>
          <app-attachment-list
            [attachments]="task().attachments"
            (filesSelected)="tasks.uploadAttachments(task().id, $event)"
            (removed)="tasks.removeAttachment(task().id, $event)"
          />
        </div>
      </div>

      <div class="flex shrink-0 border-t-2 border-ink">
        <button type="button" class="auth-submit min-h-[52px] flex-1" (click)="close()">
          Salvar alterações
        </button>
        <button
          type="button"
          class="flex-none border-l-2 border-ink px-4 text-[11px] tracking-[0.14em] text-muted uppercase hover:text-accent-700"
          (click)="openDeleteDialog()"
        >
          Excluir
        </button>
      </div>
    </aside>

    <app-prompt-dialog #tagDialog (confirmed)="onTagConfirmed($event)" />
    <app-prompt-dialog #deleteDialog (confirmed)="onDeleteConfirmed()" />
  `,
})
export class TaskEditPanelComponent {
  readonly task = input.required<Task>();

  protected readonly tasks = inject(TasksService);
  private readonly tagsService = inject(TagsService);

  private readonly tagDialog = viewChild.required<PromptDialogComponent>('tagDialog');
  private readonly deleteDialog = viewChild.required<PromptDialogComponent>('deleteDialog');

  protected readonly dueDate = computed(() => splitIsoDateTime(this.task().due_date));

  constructor() {
    this.tagsService.load();
  }

  protected onTitleChange(value: string): void {
    this.tasks.updateFields(this.task().id, { title: value });
  }

  protected onShortDescriptionChange(value: string): void {
    this.tasks.updateFields(this.task().id, { short_description: value || null });
  }

  protected onFullDescriptionChange(value: string): void {
    this.tasks.updateFields(this.task().id, { full_description: value || null });
  }

  protected onDateChange(date: string, time: string): void {
    this.tasks.updateFields(this.task().id, { due_date: combineDateTime(date, time) });
  }

  protected openTagDialog(): void {
    const existing = this.task().tags;
    this.tagDialog().open({
      title: 'Nova tag',
      confirmLabel: 'Adicionar',
      placeholder: 'Nome da tag',
      suggestions: this.tagsService.tags().filter((t) => !existing.includes(t)),
    });
  }

  protected onTagConfirmed(name: string): void {
    if (name) {
      this.tasks.addTag(this.task().id, name);
    }
  }

  protected openDeleteDialog(): void {
    this.deleteDialog().open({
      title: 'Excluir tarefa',
      message: `"${this.task().title}" será excluída permanentemente.`,
      showInput: false,
      confirmLabel: 'Excluir',
    });
  }

  protected onDeleteConfirmed(): void {
    this.tasks.delete(this.task().id);
  }

  protected close(): void {
    this.tasks.closeTaskPanel();
  }
}
