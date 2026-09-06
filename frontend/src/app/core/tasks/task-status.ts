import { TaskStatus } from './task.models';

export const TASK_STATUS_ORDER: TaskStatus[] = ['not_started', 'in_progress', 'done', 'cancelled'];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: 'Não iniciada',
  in_progress: 'Em andamento',
  done: 'Concluída',
  cancelled: 'Cancelada',
};

export const TASK_STATUS_BADGE_CLASSES: Record<TaskStatus, string> = {
  not_started: 'border-ink/40 bg-transparent text-muted',
  in_progress: 'border-accent bg-accent text-bg',
  done: 'border-ink bg-ink text-bg',
  cancelled: 'border-ink/40 bg-transparent text-muted line-through',
};

export function taskRowOpacityClass(status: TaskStatus): string {
  return status === 'cancelled' ? 'opacity-60' : '';
}
