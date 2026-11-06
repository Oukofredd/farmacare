import type { Animal } from '../types'

export type RelationKind = 'same' | 'parent-offspring' | 'full-siblings' | 'half-siblings'

export interface Relation {
  kind: RelationKind
  label: string
  risk: 'high' | 'moderate'
}

/** Normalizes an animal tag so comparisons ignore whitespace and letter case. */
const norm = (t?: string) => (t ?? '').trim().toLowerCase()

/** Close relationship between two registered animals, judged only from recorded sire/dam tags. */
export function relationBetween(a: Animal, b: Animal): Relation | null {
  if (a.id === b.id) return { kind: 'same', label: 'the same animal', risk: 'high' }
  const aTag = norm(a.tag)
  const bTag = norm(b.tag)
  if (aTag && (norm(b.sireTag) === aTag || norm(b.damTag) === aTag))
    return { kind: 'parent-offspring', label: `${a.tag} is a parent of ${b.tag}`, risk: 'high' }
  if (bTag && (norm(a.sireTag) === bTag || norm(a.damTag) === bTag))
    return { kind: 'parent-offspring', label: `${b.tag} is a parent of ${a.tag}`, risk: 'high' }
  const sameSire = !!norm(a.sireTag) && norm(a.sireTag) === norm(b.sireTag)
  const sameDam = !!norm(a.damTag) && norm(a.damTag) === norm(b.damTag)
  if (sameSire && sameDam) return { kind: 'full-siblings', label: 'full siblings (same sire and dam)', risk: 'high' }
  if (sameSire || sameDam)
    return { kind: 'half-siblings', label: `half siblings (same ${sameSire ? 'sire' : 'dam'})`, risk: 'moderate' }
  return null
}

export interface PairingWarning {
  level: 'high' | 'moderate' | 'info'
  text: string
}

/** Warnings about a planned mating between a female and a named partner. */
export function checkPairing(female: Animal, partnerTag: string, all: Animal[]): PairingWarning[] {
  const out: PairingWarning[] = []
  const t = norm(partnerTag)
  if (!t) return out
  const partner = all.find((a) => norm(a.tag) === t && a.species === female.species)
  if (!partner) {
    out.push({
      level: 'info',
      text: 'This partner is not in your register, so close relationships cannot be checked. Add his record to get a relationship check.',
    })
    return out
  }
  const rel = relationBetween(female, partner)
  if (rel)
    out.push({
      level: rel.risk,
      text: `${female.tag} and ${partner.tag} are ${rel.label}. Mating close relatives raises the chance of weak or deformed offspring. Choose an unrelated partner if you can.`,
    })
  // Shared grandparent check: both have a parent in common with one another's parents
  const fp = [norm(female.sireTag), norm(female.damTag)].filter(Boolean)
  const pp = [norm(partner.sireTag), norm(partner.damTag)].filter(Boolean)
  const parentsOfParents = fp.filter((x) => pp.includes(x))
  if (!rel && parentsOfParents.length === 0) {
    const fpAnimals = all.filter((a) => fp.includes(norm(a.tag)))
    const ppAnimals = all.filter((a) => pp.includes(norm(a.tag)))
    for (const x of fpAnimals)
      for (const y of ppAnimals) {
        const r = relationBetween(x, y)
        if (r && r.kind !== 'same')
          out.push({
            level: 'moderate',
            text: `Their parents ${x.tag} and ${y.tag} are related (${r.label}), so these two may be related too.`,
          })
      }
  }
  if (out.length === 0)
    out.push({ level: 'info', text: 'No close relationship found in your records. This only reflects what has been recorded.' })
  return out
}

/** Warnings for the sire and dam being entered on a new animal. */
export function checkParentage(
  sireTag: string,
  damTag: string,
  species: Animal['species'],
  all: Animal[],
): PairingWarning[] {
  const s = norm(sireTag)
  const d = norm(damTag)
  if (!s || !d) return []
  if (s === d) return [{ level: 'high', text: 'Sire and dam cannot be the same animal.' }]
  const sire = all.find((a) => norm(a.tag) === s && a.species === species)
  const dam = all.find((a) => norm(a.tag) === d && a.species === species)
  if (!sire || !dam) return []
  const rel = relationBetween(sire, dam)
  return rel
    ? [{ level: rel.risk, text: `The sire and dam are ${rel.label}, so this animal would be inbred. Record it honestly and avoid repeating the pairing.` }]
    : []
}

/** Finds recorded animals whose sire or dam tag matches the given animal. */
export function offspringOf(animal: Animal, all: Animal[]): Animal[] {
  const t = norm(animal.tag)
  return all.filter((a) => a.id !== animal.id && (norm(a.sireTag) === t || norm(a.damTag) === t))
}
