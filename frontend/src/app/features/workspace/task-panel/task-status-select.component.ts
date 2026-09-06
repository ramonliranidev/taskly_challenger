import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { TASK_STATUS_LABELS, TASK_STATUS_ORDER } from '../../../core/tasks/task-status';
import { TaskStatus } from '../../../core/tasks/task.models';

@Component({
  selector: 'app-task-status-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-2 border-2 border-ink">
      @for (option of order; track option; let i = $index) {
        <button
          type="button"
          class="px-3.5 py-3 text-left text-[11px] font-semibold tracking-[0.12em] uppercase"
          [class]="cellClass(i, option)"
          (click)="statusChange.emit(option)"
        >
          {{ labels[option] }}
        </button>
      }
    </div>
  `,
})
export class TaskStatusSelectComponent {
  readonly status = input.required<TaskStatus>();
  readonly statusChange = output<TaskStatus>();

  protected readonly order = TASK_STATUS_ORDER;
  protected readonly labels = TASK_STATUS_LABELS;

  protected cellClass(index: number, option: TaskStatus): string {
    const top = index > 1 ? 'border-t-2 border-ink' : '';
    const left = index % 2 === 1 ? 'border-l-2 border-ink' : '';
    const active = option === this.status() ? 'bg-accent text-bg' : 'bg-transparent text-ink';
    return `${top} ${left} ${active}`;
  }
}
