import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideKanban, LucideList } from '@lucide/angular';

import { ProjectsService } from '../../core/projects/projects.service';
import { TasksService } from '../../core/tasks/tasks.service';

/** Cabeçalho fixo da tela — README §1: marca + projeto ativo à esquerda,
 * toggle Lista/Kanban + "Nova tarefa" coladas à direita. */
@Component({
  selector: 'app-workspace-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideList, LucideKanban],
  template: `
    <header class="flex items-stretch justify-between border-b-2 border-ink bg-bg">
      <div class="flex items-center gap-[18px] px-6">
        <span class="text-[20px] font-extrabold tracking-[-0.02em]">TASKLY</span>
        <span class="h-5 w-0.5 bg-ink/40"></span>
        <span class="text-[11px] tracking-[0.14em] text-muted uppercase">
          {{ projects.activeProject()?.name }}
        </span>
      </div>
      <div class="flex items-stretch">
        <div class="flex border-l-2 border-ink">
          <button
            type="button"
            class="flex items-center gap-1.5 px-[22px] text-[12px] font-extrabold tracking-[0.14em] uppercase"
            [class]="tasks.viewMode() === 'list' ? 'bg-ink text-bg' : 'bg-transparent text-ink'"
            (click)="tasks.setViewMode('list')"
          >
            <svg lucideList class="size-4" />
            Lista
          </button>
          <button
            type="button"
            class="flex items-center gap-1.5 px-[22px] text-[12px] font-extrabold tracking-[0.14em] uppercase"
            [class]="tasks.viewMode() === 'kanban' ? 'bg-ink text-bg' : 'bg-transparent text-ink'"
            (click)="tasks.setViewMode('kanban')"
          >
            <svg lucideKanban class="size-4" />
            Kanban
          </button>
        </div>
        <button
          type="button"
          class="border-l-2 border-ink bg-accent px-[22px] text-[12px] font-extrabold tracking-[0.14em] text-bg uppercase hover:bg-accent-600"
          (click)="createTask()"
        >
          Nova tarefa
        </button>
      </div>
    </header>
  `,
})
export class WorkspaceHeaderComponent {
  protected readonly projects = inject(ProjectsService);
  protected readonly tasks = inject(TasksService);

  protected createTask(): void {
    const projectId = this.projects.activeProjectId();
    if (projectId !== null) {
      this.tasks.create(projectId).subscribe();
    }
  }
}
