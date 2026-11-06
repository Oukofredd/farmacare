import type { SpeciesId } from '../types'
import { getSpecies } from '../data/species'
import { addDays } from './dates'

export interface PlanItem {
  day: number
  date: string
  label: string
  detail: string
}

export interface Plan {
  start: string
  due: string
  earliest: string
  latest: string
  nextHeat?: { from: string; to: string }
  items: PlanItem[]
}

/** Estimated dates only. Real dates vary with breed, litter size and the individual animal. */
export function buildPlan(species: SpeciesId, start: string): Plan {
  const s = getSpecies(species)
  const items = s.milestones.map((m) => ({
    day: m.day,
    date: addDays(start, m.day),
    label: m.label,
    detail: m.detail,
  }))
  return {
    start,
    due: addDays(start, s.days),
    earliest: addDays(start, s.min),
    latest: addDays(start, s.max),
    nextHeat: s.cycleDays
      ? { from: addDays(start, s.cycleDays - 3), to: addDays(start, s.cycleDays + 3) }
      : undefined,
    items,
  }
}
