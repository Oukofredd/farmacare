import type { Animal, AnimalEvent } from '../types'

export interface Quality {
  score: number
  total: number
  percent: number
  missing: { key: string; text: string }[]
}

/** How complete and verifiable an animal's record is. Unknown values count as missing, never as fact. */
export function recordQuality(animal: Animal, events: AnimalEvent[]): Quality {
  const mine = events.filter((e) => e.animalId === animal.id)
  const checks: { key: string; ok: number; text: string }[] = [
    { key: 'breed', ok: animal.breedId !== 'unknown' ? 1 : 0, text: 'Add the breed, or mark it as mixed' },
    { key: 'dob', ok: animal.dob ? (animal.dobEstimated ? 0.5 : 1) : 0, text: animal.dob ? 'Birth date is an estimate. Confirm it if you can' : 'Add a birth date, or an estimated one' },
    { key: 'source', ok: animal.source !== 'unknown' ? 1 : 0, text: 'Record where the animal came from' },
    { key: 'parents', ok: animal.sireTag || animal.damTag ? 1 : 0, text: 'Add sire or dam if known' },
    { key: 'pedigree', ok: animal.pedigreeVerified ? 1 : 0, text: 'Parentage is unverified. Add it only once you have a record or certificate' },
    { key: 'genetic', ok: animal.geneticStatus !== 'unknown' ? 1 : 0, text: 'Genetic status is unknown. Use the checker on the Genetics page' },
    { key: 'vacc', ok: mine.some((e) => e.type === 'vaccination') ? 1 : 0, text: 'No vaccination recorded yet' },
    { key: 'weight', ok: mine.some((e) => e.type === 'weight') ? 1 : 0, text: 'No weight recorded yet' },
  ]
  const score = checks.reduce((s, c) => s + c.ok, 0)
  return {
    score,
    total: checks.length,
    percent: Math.round((score / checks.length) * 100),
    missing: checks.filter((c) => c.ok < 1).map((c) => ({ key: c.key, text: c.text })),
  }
}
