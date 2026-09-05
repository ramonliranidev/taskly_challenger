import { TaskStatus } from './task.models';

/** Ordem das colunas do Kanban — README §4. */
export const TASK_STATUS_ORDER: TaskStatus[] = ['not_started', 'in_progress', 'done', 'cancelled'];

/** Única fonte da tradução enum (backend) → rótulo pt-BR (UI). */
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: 'Não iniciada',
  in_progress: 'Em andamento',
  done: 'Concluída',
  cancelled: 'Cancelada',
};

/** Classes Tailwind da etiqueta de status — README §6 (fundo/borda/texto por status). */
export const TASK_STATUS_BADGE_CLASSES: Record<TaskStatus, string> = {
  not_started: 'border-ink/40 bg-transparent text-muted',
  in_progress: 'border-accent bg-accent text-bg',
  done: 'border-ink bg-ink text-bg',
  cancelled: 'border-ink/40 bg-transparent text-muted line-through',
};

/** Tarefa cancelada: linha/card inteiro a 60% de opacidade — README §3/§4. */
export function taskRowOpacityClass(status: TaskStatus): string {
  return status === 'cancelled' ? 'opacity-60' : '';
}
