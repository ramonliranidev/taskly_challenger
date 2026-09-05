import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ProjectsService } from '../../core/projects/projects.service';
import { TasksService } from '../../core/tasks/tasks.service';
import { KanbanBoardComponent } from './kanban/kanban-board.component';
import { ProjectSidebarComponent } from './sidebar/project-sidebar.component';
import { TaskEditPanelComponent } from './task-panel/task-edit-panel.component';
import { TaskListViewComponent } from './task-list/task-list-view.component';
import { WorkspaceHeaderComponent } from './workspace-header.component';

/**
 * Tela principal do Taskly pós-login — README (design-reference) da feature
 * de Lista/Kanban. Layout de duas linhas: cabeçalho fixo + grid de duas
 * colunas (sidebar 240px + conteúdo). O painel de edição é sobreposto
 * (`position: fixed`), não ocupa coluna do grid.
 *
 * O shell ocupa exatamente a altura da viewport (`h-screen overflow-hidden`
 * no contêiner externo, `min-h-0` na grade) e cada coluna rola sozinha
 * (`overflow-y-auto` na sidebar e na área de conteúdo) — a sidebar não
 * cresce com a lista de projetos, então o bloco de conta/Desconectar
 * (fixado na base dela via `mt-auto`) sempre fica visível sem depender do
 * scroll da lista de tarefas ao lado.
 */
@Component({
  selector: 'app-workspace',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WorkspaceHeaderComponent,
    ProjectSidebarComponent,
    TaskListViewComponent,
    KanbanBoardComponent,
    TaskEditPanelComponent,
  ],
  template: `
    <div class="flex h-screen flex-col overflow-hidden">
      <app-workspace-header />

      <div class="grid min-h-0 flex-1 grid-cols-[240px_minmax(0,1fr)] items-stretch">
        <app-project-sidebar />

        <main class="relative min-w-0 overflow-y-auto">
          @if (tasks.viewMode() === 'list') {
            <app-task-list-view />
          } @else {
            <app-kanban-board />
          }

          @if (tasks.openTask(); as task) {
            <app-task-edit-panel [task]="task" />
          }
        </main>
      </div>
    </div>
  `,
})
export class WorkspaceComponent {
  private readonly projects = inject(ProjectsService);
  protected readonly tasks = inject(TasksService);

  constructor() {
    this.projects.load().subscribe();
  }
}
