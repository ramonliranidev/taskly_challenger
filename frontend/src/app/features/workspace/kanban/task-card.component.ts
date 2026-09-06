import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { taskRowOpacityClass } from '../../../core/tasks/task-status';
import { Task } from '../../../core/tasks/task.models';
import { formatDueDate } from '../../../shared/utils/format';

@Component({
  selector: 'app-task-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Host é o cdkDrag: precisa de caixa de bloco para o clone/preview do CDK não colapsar.
  host: { class: 'block' },
  template: `
    <article
      class="flex cursor-pointer flex-col gap-2.5 border-2 bg-bg p-3.5"
      [class]="cardClass()"
      (click)="opened.emit()"
    >
      <span class="text-[14px] leading-[1.25] font-semibold text-pretty">{{ task().title }}</span>
      @if (task().short_description) {
        <span class="text-[12px] leading-[1.4] text-muted text-pretty">{{
          task().short_description
        }}</span>
      }
      @if (task().tags.length > 0) {
        <div class="flex flex-wrap gap-1.5">
          @for (tag of task().tags; track tag) {
            <span
              class="border-2 border-ink px-[7px] py-[3px] text-[10px] tracking-[0.12em] uppercase"
            >
              {{ tag }}
            </span>
          }
        </div>
      }
      <div class="flex items-center justify-between gap-2 border-t-2 border-ink/40 pt-2.5">
        <span class="text-[11px] font-semibold tracking-[0.06em] text-muted">{{ meta() }}</span>
        <span
          class="flex size-6 flex-none items-center justify-center bg-ink text-[10px] font-extrabold tracking-[0.04em] text-bg"
        >
          {{ initials() }}
        </span>
      </div>
    </article>
  `,
})
export class TaskCardComponent {
  readonly task = input.required<Task>();
  readonly isOpen = input(false);
  readonly initials = input.required<string>();
  readonly opened = output<void>();

  protected readonly meta = computed(() => {
    const t = this.task();
    const due = formatDueDate(t.due_date);
    const parts = [due.date, due.time].filter(Boolean);
    if (t.attachments.length > 0) {
      parts.push(t.attachments.length === 1 ? '1 anexo' : `${t.attachments.length} anexos`);
    }
    return parts.join(' · ');
  });

  protected cardClass(): string {
    const border = this.isOpen() ? 'border-accent' : 'border-ink/40 hover:border-ink';
    return `${border} ${taskRowOpacityClass(this.task().status)}`;
  }
}
