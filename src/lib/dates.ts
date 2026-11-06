/** Pads a month or day to two digits for ISO date strings. */
/** Pads a month or day to two digits when building an ISO date. */
const pad = (n: number) => String(n).padStart(2, '0')

/** Local calendar date as YYYY-MM-DD (not UTC, so Kenyan mornings are correct). */
export function todayISO(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Parses a YYYY-MM-DD calendar date as UTC to avoid timezone drift. */
export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

/** Formats a UTC date as the YYYY-MM-DD string used by the app. */
function toISO(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

/** Adds calendar days to an ISO date without local timezone shifts. */
export function addDays(iso: string, n: number): string {
  const d = parseISO(iso)
  d.setUTCDate(d.getUTCDate() + n)
  return toISO(d)
}

/** Returns the whole calendar-day difference from the first date to the second. */
/** Returns how many calendar days separate two ISO dates. */
export function diffDays(from: string, to: string): number {
  return Math.round((parseISO(to).getTime() - parseISO(from).getTime()) / 86_400_000)
}

/** Formats an optional ISO date for display, using a dash when it is absent. */
export function formatDate(iso?: string): string {
  if (!iso) return '—'
  return parseISO(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** Formats a date with its weekday for compact schedule headings. */
export function formatDay(iso: string): string {
  return parseISO(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

/** Describes a date relative to today, such as tomorrow or three days ago. */
export function relativeDays(iso: string, today: string = todayISO()): string {
  const n = diffDays(today, iso)
  if (n === 0) return 'today'
  if (n === 1) return 'tomorrow'
  if (n === -1) return 'yesterday'
  return n > 0 ? `in ${n} days` : `${-n} days ago`
}

/** Calculates completed months between a birth date and today. */
/** Calculates completed months of age from a birth date. */
export function ageInMonths(dob: string, today: string = todayISO()): number {
  const a = parseISO(dob)
  const b = parseISO(today)
  let m = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth())
  if (b.getUTCDate() < a.getUTCDate()) m -= 1
  return Math.max(0, m)
}

/** Converts a birth date into readable age text while preserving unknown dates. */
export function ageText(dob: string | undefined, today: string = todayISO()): string {
  if (!dob) return 'Age unknown'
  const days = diffDays(dob, today)
  if (days < 0) return 'Date in the future'
  if (days < 14) return `${days} day${days === 1 ? '' : 's'} old`
  if (days < 60) return `${Math.floor(days / 7)} weeks old`
  const months = ageInMonths(dob, today)
  if (months < 24) return `${months} months old`
  const y = Math.floor(months / 12)
  const rem = months % 12
  return rem === 0 ? `${y} years old` : `${y} yr ${rem} mo old`
}

/** Kenya's two rainy seasons, as a general national pattern. */
export function seasonFor(iso: string): { id: string; name: string; note: string } {
  const month = parseISO(iso).getUTCMonth() + 1
  if (month >= 3 && month <= 5)
    return {
      id: 'long-rains',
      name: 'Long rains (March to May)',
      note: 'Wet ground raises the risk of foot rot, worms, ticks and mastitis. Keep housing dry, drain muddy areas, and plan for feed conservation.',
    }
  if (month >= 6 && month <= 9)
    return {
      id: 'cool-dry',
      name: 'Cool, drier months (June to September)',
      note: 'A good time to conserve hay and silage for the dry months. Cold nights can chill young animals in the highlands, so keep newborns warm and dry.',
    }
  if (month >= 10 && month <= 12)
    return {
      id: 'short-rains',
      name: 'Short rains (October to December)',
      note: 'Heavy rain can bring flooding, mud-related disease, and more ticks and flies. Ask your vet whether Rift Valley fever is a risk in your area after prolonged heavy rain.',
    }
  return {
    id: 'hot-dry',
    name: 'Hot, dry months (January and February)',
    note: 'Pasture thins and water gets scarce. Plan water, shade and supplementary feed before the dry spell bites.',
  }
}
