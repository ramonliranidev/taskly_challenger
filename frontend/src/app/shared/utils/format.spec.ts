import {
  combineDateTime,
  formatBytes,
  formatDueDate,
  initialsOf,
  splitIsoDateTime,
} from './format';

describe('formatBytes', () => {
  it('formats bytes below 1024 as B', () => {
    expect(formatBytes(500)).toBe('500 B');
  });

  it('formats kilobytes', () => {
    expect(formatBytes(412 * 1024)).toBe('412 KB');
  });

  it('formats megabytes with comma decimal', () => {
    expect(formatBytes(1.4 * 1024 * 1024)).toBe('1,4 MB');
  });
});

describe('initialsOf', () => {
  it('takes first and last name initials', () => {
    expect(initialsOf('Ramon Lirani')).toBe('RL');
  });

  it('handles a single name', () => {
    expect(initialsOf('Ada')).toBe('A');
  });

  it('handles an empty name', () => {
    expect(initialsOf('   ')).toBe('—');
  });
});

describe('splitIsoDateTime / combineDateTime', () => {
  it('splits an ISO datetime into date and time', () => {
    const iso = combineDateTime('2026-06-28', '17:00')!;
    expect(splitIsoDateTime(iso)).toEqual({ date: '2026-06-28', time: '17:00' });
  });

  it('returns empty strings for null', () => {
    expect(splitIsoDateTime(null)).toEqual({ date: '', time: '' });
  });

  it('combineDateTime returns null without a date', () => {
    expect(combineDateTime('', '17:00')).toBeNull();
  });
});

describe('formatDueDate', () => {
  it('formats as DD/MM and HH:MM', () => {
    const iso = combineDateTime('2026-06-28', '17:00')!;
    expect(formatDueDate(iso)).toEqual({ date: '28/06', time: '17:00' });
  });

  it('returns a dash when there is no due date', () => {
    expect(formatDueDate(null)).toEqual({ date: '—', time: '' });
  });
});
