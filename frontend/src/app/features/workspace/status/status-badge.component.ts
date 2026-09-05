import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { TASK_STATUS_BADGE_CLASSES, TASK_STATUS_LABELS } from '../../../core/tasks/task-status';
import { TaskStatus } from '../../../core/tasks/task.models';

/** Etiqueta de status reutilizada na Lista, no Kanban (via meta) e no
 * seletor de situação do painel — README §6. */
@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex border-2 px-2 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase"
      [class]="badgeClass()"
    >
      {{ label() }}
    </span>
  `,
})
export class StatusBadgeComponent {
  readonly status = input.required<TaskStatus>();

  protected readonly label = computed(() => TASK_STATUS_LABELS[this.status()]);
  protected readonly badgeClass = computed(() => TASK_STATUS_BADGE_CLASSES[this.status()]);
}
