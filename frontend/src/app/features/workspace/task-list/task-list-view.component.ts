import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ProjectsService } from '../../../core/projects/projects.service';
import { TasksService } from '../../../core/tasks/tasks.service';
import { TaskRowComponent } from './task-row.component';

/** Visão em Lista — README §3: cabeçalho de colunas, linhas de tarefa e o
 * botão "+ Nova tarefa" de largura total ao final. */
@Component({
  selector: 'app-task-list-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskRowComponent],
  template: `
    <div
      class="flex flex-wrap gap-x-5 gap-y-3 border-b-2 border-ink/40 px-8 py-3.5 text-[11px] tracking-[0.16em] text-muted uppercase"
    >
      <span class="min-w-0 flex-[1_1_260px]">Tarefa</span>
      <div class="flex flex-none gap-4">
        <span class="w-[170px]">Tags</span>
        <span class="w-[140px]">Situação</span>
        <span class="w-[90px]">Prazo</span>
      </div>
    </div>

    @for (task of tasks.tasks(); track task.id) {
      <app-task-row
        [task]="task"
        [isOpen]="task.id === tasks.openTaskId()"
        (opened)="tasks.openTaskPanel(task.id)"
      />
    }

    <button
      type="button"
      class="w-full border-b-2 border-ink/40 px-8 py-[18px] text-left text-[12px] font-semibold tracking-[0.14em] text-accent-700 uppercase hover:bg-field"
      (click)="createTask()"
    >
      + Nova tarefa
    </button>
  `,
})
export class TaskListViewComponent {
  protected readonly projects = inject(ProjectsService);
  protected readonly tasks = inject(TasksService);

  protected createTask(): void {
    const projectId = this.projects.activeProjectId();
    if (projectId !== null) {
      this.tasks.create(projectId).subscribe();
    }
  }
}
