import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucidePencil } from '@lucide/angular';

import { Project } from '../../../core/projects/project.models';

/** Linha de projeto na sidebar — README §2. */
@Component({
  selector: 'app-project-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucidePencil],
  template: `
    <div class="flex items-stretch" [class]="active() ? 'bg-surface' : 'bg-transparent'">
      <button
        type="button"
        class="flex flex-1 items-center justify-between gap-3 border-l-[6px] py-3 pr-2 pl-6 text-left text-[14px] font-semibold"
        [class]="active() ? 'border-accent' : 'border-transparent'"
        (click)="selected.emit()"
      >
        <span class="min-w-0 truncate">{{ project().name }}</span>
        <span
          class="text-[11px] tracking-[0.08em]"
          [class]="active() ? 'text-accent-700' : 'text-muted'"
        >
          {{ project().tasks_count ?? 0 }}
        </span>
      </button>
      <button
        type="button"
        class="flex items-center gap-1 px-3 text-[11px] tracking-[0.14em] text-muted uppercase hover:text-accent-700"
        (click)="renamed.emit()"
      >
        <svg lucidePencil class="size-3.5" />
        Editar
      </button>
    </div>
  `,
})
export class ProjectListItemComponent {
  readonly project = input.required<Project>();
  readonly active = input(false);
  readonly selected = output<void>();
  readonly renamed = output<void>();
}
