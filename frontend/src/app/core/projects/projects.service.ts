import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Project } from './project.models';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  private readonly _projects = signal<Project[]>([]);
  private readonly _activeProjectId = signal<number | null>(null);

  readonly projects = this._projects.asReadonly();
  readonly activeProjectId = this._activeProjectId.asReadonly();
  readonly activeProject = computed(
    () => this._projects().find((p) => p.id === this._activeProjectId()) ?? null,
  );

  load(): Observable<Project[]> {
    return this.http.get<{ projects: Project[] }>(`${this.api}/projects`).pipe(
      map((res) => res.projects),
      tap((projects) => {
        this._projects.set(projects);
        if (this._activeProjectId() === null && projects.length > 0) {
          this._activeProjectId.set(projects[0].id);
        }
      }),
    );
  }

  selectProject(id: number): void {
    this._activeProjectId.set(id);
  }

  create(name: string): Observable<Project> {
    return this.http.post<{ project: Project }>(`${this.api}/projects`, { name }).pipe(
      map((res) => res.project),
      tap((project) => {
        this._projects.update((projects) => [...projects, project]);
        this._activeProjectId.set(project.id);
      }),
    );
  }

  rename(id: number, name: string): Observable<Project> {
    return this.http.patch<{ project: Project }>(`${this.api}/projects/${id}`, { name }).pipe(
      map((res) => res.project),
      tap((project) => {
        this._projects.update((projects) => projects.map((p) => (p.id === id ? project : p)));
      }),
    );
  }

  /** Exclui um projeto (cascata no backend: tarefas, tags e anexos). Se o
   * projeto ativo for removido, ativa o primeiro que sobrar — ou `null` se a
   * lista ficar vazia; o `effect()` de `TasksService` reage à mudança. */
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/projects/${id}`).pipe(
      tap(() => {
        this._projects.update((projects) => projects.filter((p) => p.id !== id));
        if (this._activeProjectId() === id) {
          this._activeProjectId.set(this._projects()[0]?.id ?? null);
        }
      }),
    );
  }
}
