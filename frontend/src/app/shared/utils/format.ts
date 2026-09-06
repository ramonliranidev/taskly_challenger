/** Bytes → `412 KB`, `1,4 MB`, ... (o backend só manda o valor cru). */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  const formatted = value >= 10 ? Math.round(value).toString() : value.toFixed(1).replace('.', ',');
  return `${formatted} ${units[unitIndex]}`;
}

/** Iniciais do avatar a partir do nome do usuário logado. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '—';
  }
  const first = parts[0]!.charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1]!.charAt(0) : '';
  return (first + last).toUpperCase();
}

/** `due_date` é um único ISO no backend; os inputs `date`/`time` precisam separado. */
export function splitIsoDateTime(iso: string | null): { date: string; time: string } {
  if (!iso) {
    return { date: '', time: '' };
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return { date: '', time: '' };
  }
  const pad = (n: number) => n.toString().padStart(2, '0');
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return { date, time };
}

/** Inverso de `splitIsoDateTime`. Sem data, não há prazo (`null`). */
export function combineDateTime(date: string, time: string): string | null {
  if (!date) {
    return null;
  }
  const local = new Date(`${date}T${time || '00:00'}`);
  return Number.isNaN(local.getTime()) ? null : local.toISOString();
}

/** Prazo para exibição na Lista/Kanban: `DD/MM` e `HH:MM`. */
export function formatDueDate(iso: string | null): { date: string; time: string } {
  if (!iso) {
    return { date: '—', time: '' };
  }
  const { date, time } = splitIsoDateTime(iso);
  if (!date) {
    return { date: '—', time: '' };
  }
  const [, month, day] = date.split('-');
  return { date: `${day}/${month}`, time };
}
