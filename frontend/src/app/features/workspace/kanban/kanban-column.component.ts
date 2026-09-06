import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { TASK_STATUS_LABELS } from '../../../core/tasks/task-status';
import { Task, TaskStatus } from '../../../core/tasks/task.models';
import { TaskCardComponent } from './task-card.component';

/** Coluna do Kanban — README §4. A borda entre colunas e o fundo da coluna
 * "Cancelada" são aplicados pelo `KanbanBoardComponent` (dependem da posição
 * entre irmãos, não são responsabilidade de uma coluna isolada). */
@Component({
  selector: 'app-kanban-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // O host é o próprio item da grid de colunas (grid-auto-flow: column) no
  // KanbanBoardComponent — precisa de `flex flex-col` para empilhar
  // cabeçalho fixo + corpo, herdando a altura total da linha (stretch
  // padrão do grid) para as réguas entre colunas baterem no rodapé.
  host: { class: 'flex flex-col' },
  imports: [TaskCardComponent, CdkDropList, CdkDrag],
  template: `
    <div class="flex min-h-[52px] items-center justify-between gap-3 border-b-2 border-ink/40 px-5">
      <span class="text-[11px] tracking-[0.16em] whitespace-nowrap uppercase">{{ label() }}</span>
      <span class="text-[13px] font-extrabold text-muted">{{ tasks().length }}</span>
    </div>
    <div
      class="flex flex-1 flex-col gap-4 p-4"
      cdkDropList
      cdkDropListSortingDisabled
      [cdkDropListData]="status()"
      (cdkDropListDropped)="dropped.emit($event)"
    >
      @for (task of tasks(); track task.id) {
        <app-task-card
          cdkDrag
          [cdkDragData]="task.id"
          [task]="task"
          [isOpen]="task.id === openTaskId()"
          [initials]="initials()"
          (opened)="opened.emit(task.id)"
        />
      }
      <button
        type="button"
        class="border-2 border-dashed border-ink/40 px-3 py-2.5 text-left text-[11px] tracking-[0.14em] text-muted uppercase hover:border-accent hover:text-accent-700"
        (click)="addTask.emit()"
      >
        + Adicionar
      </button>
    </div>
  `,
})
export class KanbanColumnComponent {
  readonly status = input.required<TaskStatus>();
  readonly tasks = input.required<Task[]>();
  readonly openTaskId = input<number | null>(null);
  readonly initials = input.required<string>();
  readonly opened = output<number>();
  readonly addTask = output<void>();
  /** Card solto nesta ou noutra coluna — o board lê `container`/`previousContainer`
   * (que carregam a `TaskStatus` de cada coluna) e dispara o PATCH. */
  readonly dropped = output<CdkDragDrop<TaskStatus>>();

  protected readonly label = computed(() => TASK_STATUS_LABELS[this.status()]);
}
