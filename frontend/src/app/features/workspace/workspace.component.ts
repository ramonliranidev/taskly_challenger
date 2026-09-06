import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ProjectsService } from '../../core/projects/projects.service';
import { TasksService } from '../../core/tasks/tasks.service';
import { KanbanBoardComponent } from './kanban/kanban-board.component';
import { ProjectSidebarComponent } from './sidebar/project-sidebar.component';
import { TaskEditPanelComponent } from './task-panel/task-edit-panel.component';
import { TaskListViewComponent } from './task-list/task-list-view.component';
import { WorkspaceHeaderComponent } from './workspace-header.component';

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

      <div class="grid min-h-0 flex-1 grid-cols-[264px_minmax(0,1fr)] items-stretch">
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
