/** Formata um tamanho em bytes para exibição (`412 KB`, `1,4 MB`, ...). O
 * backend sempre manda o tamanho cru em bytes — a formatação é só de UI. */
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

/** Iniciais do avatar (card do Kanban) a partir do nome do usuário logado —
 * `who` nunca é um campo do backend, é sempre derivado no cliente. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '—';
  }
  const first = parts[0]!.charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1]!.charAt(0) : '';
  return (first + last).toUpperCase();
}

/** `due_date` do backend é um único timestamp ISO — os inputs `date`/`time`
 * do painel de edição precisam dele separado em duas strings. */
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

/** Caminho inverso de `splitIsoDateTime`: combina os dois inputs num único
 * ISO para mandar ao backend. Sem data, não há prazo (`null`). */
export function combineDateTime(date: string, time: string): string | null {
  if (!date) {
    return null;
  }
  const local = new Date(`${date}T${time || '00:00'}`);
  return Number.isNaN(local.getTime()) ? null : local.toISOString();
}

/** Prazo formatado para exibição na Lista/Kanban: `DD/MM` e `HH:MM`. */
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
