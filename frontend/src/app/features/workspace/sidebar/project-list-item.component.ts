import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucidePencil, LucideTrash2 } from '@lucide/angular';

import { Project } from '../../../core/projects/project.models';

@Component({
  selector: 'app-project-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucidePencil, LucideTrash2],
  template: `
    <div
      class="flex min-w-0 items-stretch"
      [class]="active() ? 'bg-surface' : 'bg-transparent'"
    >
      <button
        type="button"
        class="flex min-w-0 flex-1 items-center justify-between gap-2 border-l-[6px] py-3 pr-1.5 pl-6 text-left text-[14px] font-semibold"
        [class]="active() ? 'border-accent' : 'border-transparent'"
        (click)="selected.emit()"
      >
        <span class="min-w-0 truncate">{{ project().name }}</span>
        <span
          class="shrink-0 text-[11px] tracking-[0.08em]"
          [class]="active() ? 'text-accent-700' : 'text-muted'"
        >
          {{ project().tasks_count ?? 0 }}
        </span>
      </button>
      <button
        type="button"
        class="flex shrink-0 items-center gap-1 px-2.5 text-[11px] tracking-[0.14em] whitespace-nowrap text-muted uppercase hover:text-accent-700"
        (click)="renamed.emit()"
      >
        <svg lucidePencil class="size-3.5" />
        Editar
      </button>
      <button
        type="button"
        aria-label="Excluir projeto"
        class="flex shrink-0 items-center pr-4 pl-2.5 text-muted hover:text-accent-700"
        (click)="deleted.emit()"
      >
        <svg lucideTrash2 class="size-3.5" />
      </button>
    </div>
  `,
})
export class ProjectListItemComponent {
  readonly project = input.required<Project>();
  readonly active = input(false);
  readonly selected = output<void>();
  readonly renamed = output<void>();
  readonly deleted = output<void>();
}
