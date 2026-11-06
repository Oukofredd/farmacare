import { useState } from 'react'
import { Badge, BookmarkButton, Callout, PageHeader, ReviewBadge, Section } from '../components/ui'
import { FEED_GUIDES, INGREDIENTS } from '../data/feeding'
import { SPECIES } from '../data/species'
import type { SpeciesId } from '../types'

/** Filters general feeding guides by species and animal life stage. */
export default function Feeding() {
  const [species, setSpecies] = useState<SpeciesId | 'all'>(() => {
    const h = typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
    return FEED_GUIDES.find((g) => g.id === h)?.species ?? 'all'
  })
  const guides = FEED_GUIDES.filter((g) => species === 'all' || g.species === species)
  const chips = [{ id: 'all' as const, name: 'All' }, ...SPECIES.map((s) => ({ id: s.id, name: s.name }))]
  return (
    <div>
      <PageHeader title="Feeding and nutrition" subtitle="Feed by species, age and stage. Water first, forage next." action={<ReviewBadge />} />
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Species">
        {chips.map((s) => (
          <button key={s.id} type="button" aria-pressed={species === s.id} onClick={() => setSpecies(s.id)}
            className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${species === s.id ? 'border-transparent bg-napier text-white' : 'border-line bg-white hover:bg-napier-tint'}`}>{s.name}</button>
        ))}
      </div>

      <Callout tone="warn" title="No exact rations here">
        Amounts depend on weight, yield, feed quality and health. Ask a nutritionist or extension officer for exact rations.
      </Callout>

      <div className="mt-6 space-y-4">
        {guides.map((g) => (
          <article key={g.id} id={g.id} className="scroll-mt-20 rounded-2xl border border-line bg-white p-4 md:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold">{g.title}</h2>
                <div className="mt-1 flex flex-wrap gap-1.5"><Badge tone="green">{SPECIES.find((s) => s.id === g.species)!.name}</Badge><Badge>{g.stage}</Badge></div>
              </div>
              <BookmarkButton id={`feed:${g.id}`} />
            </div>
            <p className="mt-3 max-w-prose">{g.summary}</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div><h3 className="font-bold text-napier-dark">Do</h3><ul className="mt-1 list-disc space-y-1.5 pl-5">{g.points.map((p) => <li key={p}>{p}</li>)}</ul></div>
              <div><h3 className="font-bold text-murram-dark">Avoid</h3><ul className="mt-1 list-disc space-y-1.5 pl-5">{g.avoid.map((p) => <li key={p}>{p}</li>)}</ul></div>
            </div>
          </article>
        ))}
      </div>

      <Section title="Common feeds and what to watch for">
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {INGREDIENTS.map((i) => (
            <li key={i.id} className="p-4">
              <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{i.name}</h3><Badge tone="blue">{i.type}</Badge></div>
              <p className="text-sm text-muted">For: {i.species}</p>
              <p className="mt-1">{i.purpose}</p>
              <p className="mt-1 text-[0.95rem]"><span className="font-semibold">Caution:</span> {i.caution}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Clean water and safe storage">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Clean water must be available all day. Check troughs and drinkers every morning and clean them often.</li>
          <li>Store feed dry, off the floor and ventilated. Throw away anything mouldy.</li>
          <li>Change feeds gradually over several days.</li>
        </ul>
      </Section>
    </div>
  )
}
