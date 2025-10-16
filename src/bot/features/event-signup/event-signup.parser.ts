export interface EventCommandArgs {
  lugar: string;
  date: Date;
  epoch: number;
  utcLabel: string;
  dayLabel: string;
}

const COMMANDS = [
  '/crear-evento',
  '//crear-evento',
  '!crear-evento',
  'crear-evento',
];

export function parseEventoArgsUTC(text: string): EventCommandArgs | null {
  const lower = text.toLowerCase();
  const cmd = COMMANDS.find((c) => lower.startsWith(c));
  if (!cmd) {
    return null;
  }

  const rest = text.slice(cmd.length).trim();
  const parts = rest
    .split('|')
    .map((part) => part?.trim())
    .filter(Boolean);

  if (parts.length < 2) {
    return null;
  }

  const lugarPartRaw = parts[0] ?? '';
  const timeRaw = parts[parts.length - 1] ?? '';
  const dayRaw =
    parts.length >= 3 ? parts.slice(1, parts.length - 1).join(' ') : undefined;

  if (!lugarPartRaw || !timeRaw) {
    return null;
  }

  const dayOffset = parseDayOffset(dayRaw);
  if (dayRaw && dayOffset === null) {
    return null;
  }

  if (!/^\d{2}:\d{2}$/.test(timeRaw)) {
    return null;
  }

  const [hours, minutes] = timeRaw.split(':').map(Number);
  if (hours > 23 || minutes > 59) {
    return null;
  }

  const now = new Date();
  const baseDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      hours,
      minutes,
      0,
    ),
  );

  if (typeof dayOffset === 'number') {
    baseDate.setUTCDate(baseDate.getUTCDate() + dayOffset);
  }

  const utcDate = `${baseDate.getUTCFullYear()}-${String(baseDate.getUTCMonth() + 1).padStart(2, '0')}-${String(baseDate.getUTCDate()).padStart(2, '0')}`;
  const utcTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  return {
    lugar: lugarPartRaw,
    date: baseDate,
    epoch: Math.floor(baseDate.getTime() / 1000),
    utcLabel: `${utcDate} ${utcTime} UTC`,
    dayLabel: getDayLabel(dayOffset ?? 0),
  };
}

function parseDayOffset(raw?: string | null): number | null {
  if (!raw || raw.length === 0) {
    return 0;
  }

  const normalized = raw.toLowerCase();

  if (['hoy', 'today', '0'].includes(normalized)) {
    return 0;
  }

  if (['mañana', 'manana', 'tomorrow', '1'].includes(normalized)) {
    return 1;
  }

  const numeric = normalized.match(/^([+-]?\d{1,2})$/);
  if (numeric) {
    return Number.parseInt(numeric[1], 10);
  }

  const weekdays = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'miercoles',
    'jueves',
    'viernes',
    'sábado',
    'sabado',
  ];

  const idx = weekdays.indexOf(normalized);
  if (idx !== -1) {
    const today = new Date().getUTCDay();
    let offset = idx - today;
    if (offset < 0) {
      offset += 7;
    }
    return offset;
  }

  return null;
}

function getDayLabel(offset: number): string {
  if (offset === 0) {
    return 'Hoy';
  }
  if (offset === 1) {
    return 'Mañana';
  }
  if (offset === -1) {
    return 'Ayer';
  }
  if (offset > 1) {
    return `En ${offset} días`;
  }
  return `Hace ${Math.abs(offset)} días`;
}
