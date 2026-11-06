import type { Db, SpeciesId } from '../types'
import { diffDays, formatDate } from './dates'
import { buildSchedule } from './schedule'
import type { Forecast } from './weather'

// Advisory messages are shown on the home page and in the notifications panel. They are generated from farm records, weather forecasts, and other sources. Each advisory has a level of urgency, a title, a detail message, and an optional link to more information.
// an interface defines the structure of an object
export interface Advisory {
  id: string
  level: 'urgent' | 'soon' | 'info'
  title: string
  detail: string
  href?: string
}

const ORDER = { urgent: 0, soon: 1, info: 2 }

/** Uses farm records to identify relevant species, falling back to preferences. */
function farmSpecies(db: Db): Set<SpeciesId> {
  const active = db.animals.filter((a) => a.status === 'active').map((a) => a.species)
  return new Set(active.length ? active : db.prefs.species)
}

/** Turns forecast conditions into general weather reminders for this farm. */
export function weatherAdvisories(db: Db, f: Forecast | null | undefined): Advisory[] {
  if (!f) return []
  const out: Advisory[] = []
  const sp = farmSpecies(db)
  const next3 = f.days.slice(0, 3)
  const hottest = Math.max(...next3.map((d) => d.max))
  const wettest = Math.max(...f.days.map((d) => d.rain))
  const coldest = Math.min(...f.days.map((d) => d.min))

  if (hottest >= 30) {
    const heatSensitive = (['pig', 'chicken', 'cattle'] as SpeciesId[]).filter((s) => sp.has(s))
    out.push({
      id: 'wx-heat',
      level: hottest >= 35 ? 'urgent' : 'soon',
      title: hottest >= 35 ? 'Very hot days ahead' : 'Hot weather ahead',
      detail: `Up to ${Math.round(hottest)}°C in the next 3 days. Give shade and plenty of cool, clean water, and feed in the cooler morning and evening hours.${heatSensitive.length ? ` Pigs, high-yielding dairy cows and fast-growing chickens are the most at risk.` : ''} Panting, drooling and standing apart are heat-stress signs.`,
      href: '/weather',
    })
  }
  if (wettest >= 20)
    out.push({
      id: 'wx-rain',
      level: 'soon',
      title: 'Heavy rain forecast',
      detail: `About ${Math.round(wettest)} mm expected on one day. Drain muddy areas, keep bedding dry, move animals off low ground, and store feed off the floor to prevent mould.`,
      href: '/weather',
    })
  if (coldest <= 12 && (sp.has('chicken') || sp.has('pig') || db.animals.some((a) => a.dob && diffDays(a.dob, f.days[0].date) < 90)))
    out.push({
      id: 'wx-cold',
      level: 'info',
      title: 'Cold nights: protect young stock',
      detail: `Nights may drop to ${Math.round(coldest)}°C. Chicks, piglets, kids, lambs and calves chill quickly. Keep them dry, out of draughts and, if needed, warm.`,
      href: '/weather',
    })
  return out
}

/** Combines schedule, record-quality, and weather messages by urgency. */
export function buildAdvisories(db: Db, today: string, forecast?: Forecast | null): Advisory[] {
  const out: Advisory[] = []
  for (const it of buildSchedule(db, today)) {
    const d = diffDays(today, it.date)
    if (it.kind === 'withdrawal') {
      out.push({ id: it.id, level: 'urgent', title: it.title, detail: it.detail, href: `/animals/${it.animalId}?tab=health` })
    } else if (it.kind === 'due') {
      if (it.overdue)
        out.push({
          id: it.id,
          level: 'urgent',
          title: `${it.tag} is ${-d} day${d === -1 ? '' : 's'} past the estimated date`,
          detail: 'Estimated dates can be out by several days. Check her, and call a vet if you see trouble or she goes well beyond the usual range. Record the outcome when it happens.',
          href: `/animals/${it.animalId}?tab=breeding`,
        })
      else if (d <= 7)
        out.push({ id: it.id, level: 'soon', title: `${it.title} ${d === 0 ? 'today' : `in ${d} day${d === 1 ? '' : 's'}`}`, detail: it.detail, href: `/animals/${it.animalId}?tab=breeding` })
    } else if (it.kind === 'recheck') {
      if (it.overdue) out.push({ id: it.id, level: 'urgent', title: `${it.title} (overdue)`, detail: it.detail, href: `/animals/${it.animalId}?tab=health` })
      else if (d <= db.prefs.reminderDays) out.push({ id: it.id, level: 'soon', title: `${it.title} on ${formatDate(it.date)}`, detail: it.detail, href: `/animals/${it.animalId}?tab=health` })
    } else if (it.kind === 'milestone' && d <= 7) {
      out.push({ id: it.id, level: 'soon', title: `${it.title} (${d <= 0 ? 'now' : `in ${d} day${d === 1 ? '' : 's'}`})`, detail: it.detail, href: `/animals/${it.animalId}?tab=breeding` })
    }
  }

  const active = db.animals.filter((a) => a.status === 'active')
  const unverified = active.filter((a) => a.source === 'unknown' || (a.dobEstimated && !a.dob) || a.geneticStatus === 'unknown')
  if (unverified.length)
    out.push({
      id: 'verify',
      level: 'info',
      title: `${unverified.length} animal${unverified.length === 1 ? ' has' : 's have'} unverified history`,
      detail: 'Unknown origin or genetic status is shown as unknown, never guessed. Fill in what you can confirm.',
      href: '/animals?filter=verify',
    })

  const staleBreedings = db.events.filter(
    (e) =>
      e.type === 'breeding' &&
      e.pregnancy !== 'not_pregnant' &&
      !db.events.some((b) => b.type === 'birth' && b.linkedId === e.id) &&
      e.expectedDue &&
      diffDays(e.expectedDue, today) > 45,
  )
  if (staleBreedings.length)
    out.push({
      id: 'stale-breed',
      level: 'info',
      title: `${staleBreedings.length} breeding record${staleBreedings.length === 1 ? ' has' : 's have'} no outcome`,
      detail: 'Open the animal, then mark the pregnancy as "not pregnant" or record the birth so your history stays accurate.',
    })

  out.push(...weatherAdvisories(db, forecast))
  return out.sort((a, b) => ORDER[a.level] - ORDER[b.level])
}

