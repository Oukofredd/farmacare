import { useState } from 'react'
import { Badge, Callout, Card, PageHeader, ReviewBadge, Tabs, VetNote } from '../components/ui'
import { DISEASES, FOOD_SAFETY, PREVENTIVE_PRINCIPLES, WARNING_SIGNS, WELFARE } from '../data/health'
import { SPECIES } from '../data/species'
import type { SpeciesId } from '../types'

type T = 'prevent' | 'signs' | 'welfare' | 'food'
const LEVEL = {
  emergency: { label: 'Call a vet now', tone: 'red' as const },
  'same-day': { label: 'Call a vet today', tone: 'yellow' as const },
  isolate: { label: 'Separate and watch', tone: 'blue' as const },
}

/** Renders a collection of general health guidance cards. */
function Items({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
      {items.map((i) => <li key={i.title} className="p-4"><h3 className="font-bold">{i.title}</h3><p className="mt-0.5 max-w-prose text-muted">{i.body}</p></li>)}
    </ul>
  )
}

/** Presents reviewed-draft health guidance across the available topic tabs. */
export default function Health() {
  const [tab, setTab] = useState<T>('prevent')
  const [species, setSpecies] = useState<SpeciesId | 'all'>('all')
  const chips = [{ id: 'all' as const, name: 'All species' }, ...SPECIES.map((s) => ({ id: s.id, name: s.name }))]
  /** Checks whether a health item applies to the selected species filter. */
  const pick = <X extends { species: SpeciesId[] | 'all' }>(x: X) => species === 'all' || x.species === 'all' || x.species.includes(species)
  const diseases = DISEASES.filter((d) => species === 'all' || d.species.includes(species))
  const signs = WARNING_SIGNS.filter(pick)

  return (
    <div>
      <PageHeader title="Health and care" subtitle="Prevention, warning signs, welfare and food safety." action={<ReviewBadge />} />
      <Tabs label="Health topics" value={tab} onChange={setTab} tabs={[{ id: 'prevent', label: 'Prevention' }, { id: 'signs', label: 'Warning signs' }, { id: 'welfare', label: 'Welfare' }, { id: 'food', label: 'Food safety' }]} />

      {(tab === 'prevent' || tab === 'signs') && (
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Species">
          {chips.map((s) => (
            <button key={s.id} type="button" aria-pressed={species === s.id} onClick={() => setSpecies(s.id)}
              className={`min-h-10 rounded-full border px-3.5 text-sm font-semibold ${species === s.id ? 'border-transparent bg-napier text-white' : 'border-line bg-white hover:bg-napier-tint'}`}>{s.name}</button>
          ))}
        </div>
      )}

      {tab === 'prevent' && (
        <div className="space-y-6">
          <Items items={PREVENTIVE_PRINCIPLES} />
          <div>
            <h2 className="mb-2 text-xl font-bold">Diseases to know about</h2>
            <ul className="space-y-3">
              {diseases.map((d) => (
                <li key={d.name}>
                  <Card>
                    <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{d.name}</h3>{d.report && <Badge tone="red">Report if suspected</Badge>}</div>
                    <p className="mt-1">{d.what}</p>
                    <p className="mt-1 text-[0.95rem] text-muted"><span className="font-semibold text-humus">Prevention:</span> {d.prevention}</p>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
          <Callout tone="info" title="Vaccine schedules differ by county">Ask your sub-county veterinary officer which vaccines are needed, then record them in the animal's Health tab to get reminders.</Callout>
        </div>
      )}

      {tab === 'signs' && (
        <div className="space-y-4">
          <Callout tone="danger" title="This is not a diagnosis tool">Warning signs tell you when to get help. They do not tell you what the illness is. When unsure, call a vet.</Callout>
          <ul className="space-y-3">
            {signs.map((w) => (
              <li key={w.sign} className="rounded-2xl border border-line bg-white p-4">
                <Badge tone={LEVEL[w.level].tone}>{LEVEL[w.level].label}</Badge>
                <p className="mt-2 font-bold">{w.sign}</p>
                <p className="mt-0.5 text-muted">{w.note}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'welfare' && <Items items={WELFARE} />}
      {tab === 'food' && <Items items={FOOD_SAFETY} />}

      <div className="mt-8"><VetNote /></div>
    </div>
  )
}
