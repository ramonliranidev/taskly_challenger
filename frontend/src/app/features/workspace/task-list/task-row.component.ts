import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { taskRowOpacityClass } from '../../../core/tasks/task-status';
import { Task } from '../../../core/tasks/task.models';
import { formatDueDate } from '../../../shared/utils/format';
import { StatusBadgeComponent } from '../status/status-badge.component';

/** Linha de tarefa na visão Lista — README §3. O grupo de metadados quebra
 * pra uma segunda linha (flex-wrap) antes de encolher o bloco de título. */
@Component({
  selector: 'app-task-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatusBadgeComponent],
  template: `
    <div
      class="flex flex-wrap items-start gap-x-5 gap-y-3 border-b-2 border-ink/40 px-8 py-[18px] cursor-pointer"
      [class]="rowClass()"
      (click)="opened.emit()"
    >
      <div class="flex min-w-0 flex-[1_1_260px] flex-col gap-1">
        <span class="text-[16px] font-semibold tracking-[-0.01em]">{{ task().title }}</span>
        @if (task().short_description) {
          <span class="text-[13px] text-muted text-pretty">{{ task().short_description }}</span>
        }
        @if (task().attachments.length > 0) {
          <span class="text-[11px] tracking-[0.12em] text-accent-700 uppercase">
            {{ attachmentLabel() }}
          </span>
        }
      </div>

      <div class="flex flex-none items-start gap-4">
        <div class="flex w-[170px] flex-wrap content-start gap-1.5">
          @for (tag of task().tags; track tag) {
            <span
              class="border-2 border-ink/40 px-[7px] py-[3px] text-[10px] tracking-[0.12em] text-muted uppercase"
            >
              {{ tag }}
            </span>
          }
        </div>
        <div class="w-[140px]">
          <app-status-badge [status]="task().status" />
        </div>
        <div class="flex w-[90px] flex-col gap-0.5">
          <span class="text-[13px] font-semibold tracking-[0.04em]" [class]="dueDateClass()">
            {{ due().date }}
          </span>
          @if (due().time) {
            <span class="text-[11px] text-muted">{{ due().time }}</span>
          }
        </div>
      </div>
    </div>
  `,
})
export class TaskRowComponent {
  readonly task = input.required<Task>();
  readonly isOpen = input(false);
  readonly opened = output<void>();

  protected readonly due = computed(() => formatDueDate(this.task().due_date));
  protected readonly attachmentLabel = computed(() => {
    const n = this.task().attachments.length;
    return n === 1 ? '1 anexo' : `${n} anexos`;
  });

  protected rowClass(): string {
    const bg = this.isOpen() ? 'bg-surface' : 'hover:bg-field';
    return `${bg} ${taskRowOpacityClass(this.task().status)}`;
  }

  protected dueDateClass(): string {
    const status = this.task().status;
    return status === 'done' || status === 'cancelled' ? 'text-muted' : 'text-ink';
  }
}
