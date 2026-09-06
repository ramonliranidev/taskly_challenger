/** Bate 1:1 com o enum `App\Enums\TaskStatus` do backend. */
export type TaskStatus = 'not_started' | 'in_progress' | 'done' | 'cancelled';

export interface Attachment {
  id: number;
  kind: string;
  name: string;
  size: number;
  url: string;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  short_description: string | null;
  full_description: string | null;
  /** ISO 8601 ou `null` — data+hora num único campo, como no backend. */
  due_date: string | null;
  status: TaskStatus;
  tags: string[];
  attachments: Attachment[];
  created_at: string;
  updated_at: string;
}

/** Todos os campos opcionais — o painel de edição salva por campo (PATCH parcial). */
export interface UpdateTaskPayload {
  title?: string;
  short_description?: string | null;
  full_description?: string | null;
  due_date?: string | null;
  status?: TaskStatus;
  tags?: string[];
}
