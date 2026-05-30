const MONTHS: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

const INVALID_TIMESTAMP = Number.MIN_SAFE_INTEGER;

const MONTH_NAME_PATTERN =
  'January|February|March|April|May|June|July|August|September|October|November|December';

const MONTH_RANGE_PATTERN = new RegExp(
  `\\b(${MONTH_NAME_PATTERN})\\s+(\\d{1,2})(?:\\s*-\\s*(?:(${MONTH_NAME_PATTERN})\\s+)?(\\d{1,2}))?,?\\s*((?:19|20)\\d{2})\\b`,
  'i',
);

export type NewsDateParts = {
  start: number;
  end: number;
};

function normalizeNewsDateInput(date: string) {
  return date.replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ').trim();
}

/** Parse start/end timestamps for sorting and display logic. */
export function parseNewsDateParts(date?: string): NewsDateParts {
  if (!date) {
    return { start: INVALID_TIMESTAMP, end: INVALID_TIMESTAMP };
  }

  const normalized = normalizeNewsDateInput(date);
  const monthRange = normalized.match(MONTH_RANGE_PATTERN);

  if (monthRange) {
    const startMonthName = monthRange[1].toLowerCase();
    const startDay = Number(monthRange[2]);
    const endMonthName = (monthRange[3] || monthRange[1]).toLowerCase();
    const endDay = Number(monthRange[4] || monthRange[2]);
    const year = Number(monthRange[5]);
    const startMonthIndex = MONTHS[startMonthName];
    const endMonthIndex = MONTHS[endMonthName];

    if (startMonthIndex === undefined || endMonthIndex === undefined) {
      return { start: INVALID_TIMESTAMP, end: INVALID_TIMESTAMP };
    }

    return {
      start: new Date(year, startMonthIndex, startDay).getTime(),
      end: new Date(year, endMonthIndex, endDay).getTime(),
    };
  }

  const parsed = Date.parse(normalized);
  if (!Number.isNaN(parsed)) {
    return { start: parsed, end: parsed };
  }

  const year = normalized.match(/\b(19|20)\d{2}\b/)?.[0];
  if (year) {
    const fallback = new Date(`${year}-01-01`).getTime();
    return { start: fallback, end: fallback };
  }

  return { start: INVALID_TIMESTAMP, end: INVALID_TIMESTAMP };
}

/** Primary sort key: event start date (first day of a range). */
export function parseNewsDate(date?: string) {
  return parseNewsDateParts(date).start;
}

/**
 * Sort newest first. When start dates match, shorter ranges (or single days) rank
 * above longer ranges — e.g. "May 22, 2026" before "May 22-24, 2026".
 */
export function compareNewsDatesDesc(dateA?: string, dateB?: string) {
  const a = parseNewsDateParts(dateA);
  const b = parseNewsDateParts(dateB);

  if (b.start !== a.start) {
    return b.start - a.start;
  }

  return a.end - b.end;
}
