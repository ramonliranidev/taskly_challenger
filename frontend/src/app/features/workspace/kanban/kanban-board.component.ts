import { CdkDragDrop, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { ProjectsService } from '../../../core/projects/projects.service';
import { TasksService } from '../../../core/tasks/tasks.service';
import { TaskStatus } from '../../../core/tasks/task.models';
import { initialsOf } from '../../../shared/utils/format';
import { KanbanColumnComponent } from './kanban-column.component';

/** Borda entre colunas (exceto a última) e o fundo da coluna "Cancelada" são
 * aplicados aqui, por dependerem da posição entre irmãs. */
@Component({
  selector: 'app-kanban-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KanbanColumnComponent, CdkDropListGroup],
  template: `
    <div
      class="grid h-full auto-cols-[minmax(250px,1fr)] grid-flow-col items-stretch overflow-x-auto"
      cdkDropListGroup
    >
      @for (column of tasks.byStatus(); track column.status; let last = $last) {
        <app-kanban-column
          [class]="columnClass(column.status, last)"
          [status]="column.status"
          [tasks]="column.tasks"
          [openTaskId]="tasks.openTaskId()"
          [initials]="initials()"
          (opened)="tasks.openTaskPanel($event)"
          (addTask)="createTask()"
          (dropped)="onDropped($event)"
        />
      }
    </div>
  `,
})
export class KanbanBoardComponent {
  protected readonly projects = inject(ProjectsService);
  protected readonly tasks = inject(TasksService);
  private readonly auth = inject(AuthService);

  protected readonly initials = computed(() => initialsOf(this.auth.user()?.name ?? ''));

  protected columnClass(status: string, last: boolean): string {
    const border = last ? '' : 'border-r-2 border-ink/40';
    const bg = status === 'cancelled' ? 'bg-field' : '';
    return `${border} ${bg}`;
  }

  protected onDropped(event: CdkDragDrop<TaskStatus>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    this.tasks.updateStatus(event.item.data as number, event.container.data);
  }

  protected createTask(): void {
    const projectId = this.projects.activeProjectId();
    if (projectId !== null) {
      this.tasks.create(projectId).subscribe();
    }
  }
}
