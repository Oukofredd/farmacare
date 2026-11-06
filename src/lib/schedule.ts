import type { AnimalEvent, Db } from '../types'
import { getSpecies } from '../data/species'
import { addDays, diffDays, formatDate } from './dates'
import { buildPlan } from './lifecycle'

export type ScheduleKind = 'due' | 'milestone' | 'recheck' | 'withdrawal'

export interface ScheduleItem {
  id: string
  date: string
  kind: ScheduleKind
  title: string
  detail: string
  animalId: string
  tag: string
  overdue: boolean
  /** true when the date is calculated rather than observed */
  estimated: boolean
}

/** Breeding events that have not yet ended in a birth or a negative pregnancy result. */
export function openBreedings(events: AnimalEvent[], animalId?: string): AnimalEvent[] {
  return events.filter(
    (e) =>
      e.type === 'breeding' &&
      (!animalId || e.animalId === animalId) &&
      e.pregnancy !== 'not_pregnant' &&
      !events.some((b) => b.type === 'birth' && b.linkedId === e.id),
  )
}

const WITHDRAWAL_WORD: Record<string, string> = {
  milk: 'milk',
  meat: 'meat',
  eggs: 'eggs',
  milk_and_meat: 'milk and meat',
}

/** Builds dated reminders for births, milestones, follow-ups, and withdrawals. */
export function buildSchedule(db: Db, today: string): ScheduleItem[] {
  const items: ScheduleItem[] = []
  const byId = new Map(db.animals.map((a) => [a.id, a]))

  for (const ev of openBreedings(db.events)) {
    const animal = byId.get(ev.animalId)
    if (!animal || animal.status !== 'active') continue
    const sp = getSpecies(animal.species)
    const plan = buildPlan(animal.species, ev.date)
    const due = ev.expectedDue ?? plan.due
    if (diffDays(due, today) > 45) continue // stale record: surfaced as "needs an outcome" instead
    const confirmed = ev.pregnancy === 'confirmed'
    items.push({
      id: `${ev.id}:due`,
      date: due,
      kind: 'due',
      title: `${animal.tag}: ${sp.birthWord.toLowerCase()} expected`,
      detail: confirmed
        ? 'Estimated date. Pregnancy confirmed.'
        : sp.kind === 'incubation'
          ? 'Estimated hatch date.'
          : 'Estimated date. Pregnancy not yet confirmed.',
      animalId: animal.id,
      tag: animal.tag,
      overdue: diffDays(today, due) < 0,
      estimated: true,
    })
    for (const m of plan.items) {
      if (confirmed && /return to heat|confirm pregnancy/i.test(m.label)) continue
      if (diffDays(today, m.date) < -2) continue
      items.push({
        id: `${ev.id}:m${m.day}`,
        date: m.date,
        kind: 'milestone',
        title: `${animal.tag}: ${m.label.toLowerCase()}`,
        detail: m.detail,
        animalId: animal.id,
        tag: animal.tag,
        overdue: false,
        estimated: true,
      })
    }
  }

  for (const ev of db.events) {
    const animal = byId.get(ev.animalId)
    if (!animal || animal.status !== 'active') continue
    if ((ev.type === 'vaccination' || ev.type === 'treatment') && ev.nextDue) {
      const done = db.events.some(
        (e2) =>
          e2.animalId === ev.animalId &&
          e2.type === ev.type &&
          e2.title.trim().toLowerCase() === ev.title.trim().toLowerCase() &&
          e2.date > ev.date,
      )
      if (!done && diffDays(ev.nextDue, today) <= 60)
        items.push({
          id: `${ev.id}:next`,
          date: ev.nextDue,
          kind: 'recheck',
          title: `${animal.tag}: ${ev.title} is due`,
          detail: `Follow-up to the ${ev.type} recorded on ${formatDate(ev.date)}.`,
          animalId: animal.id,
          tag: animal.tag,
          overdue: diffDays(today, ev.nextDue) < 0,
          estimated: false,
        })
    }
    if (ev.type === 'treatment' && ev.withdrawalDays && ev.withdrawalDays > 0) {
      const end = addDays(ev.date, ev.withdrawalDays)
      if (diffDays(today, end) >= 0)
        items.push({
          id: `${ev.id}:withdrawal`,
          date: end,
          kind: 'withdrawal',
          title: `${animal.tag}: do not sell ${WITHDRAWAL_WORD[ev.withdrawalFor ?? 'milk_and_meat']} until ${formatDate(end)}`,
          detail: `Withdrawal period after "${ev.title}". This is a reminder counted from the treatment date. The product label and your vet decide the real period.`,
          animalId: animal.id,
          tag: animal.tag,
          overdue: false,
          estimated: false,
        })
    }
  }

  return items.sort((a, b) => a.date.localeCompare(b.date))
}
