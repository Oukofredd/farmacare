import { useState } from 'react'
import { Link } from 'react-router'
import { Badge, Button, Card, Field, PageHeader, ReviewBadge, inputCls } from '../components/ui'
import { BREEDS, PURPOSE_LABEL, TYPE_LABEL, matchBreeds } from '../data/breeds'
import type { FitInput, Purpose } from '../data/breeds'
import { SPECIES } from '../data/species'
import type { SpeciesId } from '../types'

const HEAT = ['', 'Low', 'Medium', 'High']
const NEED = ['', 'Low', 'Medium', 'High']

/** Lets farmers filter, compare, and inspect breed information. */
export default function Breeds() {
  const [species, setSpecies] = useState<SpeciesId>('cattle')
  const [compare, setCompare] = useState<string[]>([])
  const [showMatch, setShowMatch] = useState(false)
  const [fit, setFit] = useState<Omit<FitInput, 'species'>>({ goal: 'milk', climate: 'warm-humid', management: 2, feed: 2 })

  const list = BREEDS.filter((b) => b.species === species)
  const picked = BREEDS.filter((b) => compare.includes(b.id))
  const results = showMatch ? matchBreeds({ ...fit, species }) : []
  /** Adds or removes a breed from the comparison list, capped at three. */
  const toggle = (id: string) => setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? c : [...c, id]))
  const goals = Array.from(new Set(list.flatMap((b) => b.purposes))) as Purpose[]

  return (
    <div>
      <PageHeader title="Breed library" subtitle="There is no single best breed. Match a breed to your goal, climate, feed and management." action={<ReviewBadge />} />
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Species">
        {SPECIES.map((s) => (
          <button key={s.id} type="button" aria-pressed={species === s.id}
            onClick={() => { setSpecies(s.id); setCompare([]); setShowMatch(false) }}
            className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${species === s.id ? 'border-transparent bg-napier text-white' : 'border-line bg-white hover:bg-napier-tint'}`}>{s.name}</button>
        ))}
      </div>

      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div><h2 className="text-lg font-bold">Match breeds to my farm</h2><p className="text-sm text-muted">Answer four questions. You get reasons, not a ranking.</p></div>
          <Button variant={showMatch ? 'secondary' : 'primary'} onClick={() => setShowMatch((v) => !v)}>{showMatch ? 'Hide matcher' : 'Open matcher'}</Button>
        </div>
        {showMatch && (
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Main goal"><select className={inputCls} value={fit.goal} onChange={(e) => setFit({ ...fit, goal: e.target.value as Purpose })}>
                {(goals.length ? goals : (['milk', 'meat', 'eggs', 'dual'] as Purpose[])).map((g) => <option key={g} value={g}>{PURPOSE_LABEL[g]}</option>)}</select></Field>
              <Field label="Climate"><select className={inputCls} value={fit.climate} onChange={(e) => setFit({ ...fit, climate: e.target.value as FitInput['climate'] })}>
                <option value="hot">Hot and dry</option><option value="warm-humid">Warm or humid</option><option value="cool">Cool highlands</option></select></Field>
              <Field label="Management you can give"><select className={inputCls} value={fit.management} onChange={(e) => setFit({ ...fit, management: Number(e.target.value) as 1 | 2 | 3 })}>
                <option value={1}>Low input (free range, little vet access)</option><option value={2}>Moderate</option><option value={3}>Intensive (housing, regular vet care)</option></select></Field>
              <Field label="Feed you can reliably provide"><select className={inputCls} value={fit.feed} onChange={(e) => setFit({ ...fit, feed: Number(e.target.value) as 1 | 2 | 3 })}>
                <option value={1}>Mostly local forage or scavenging</option><option value={2}>Good forage plus some supplements</option><option value={3}>High-quality feed all year</option></select></Field>
            </div>
            <ul className="space-y-2">
              {results.map((r) => (
                <li key={r.breed.id} className="rounded-xl border border-line p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <Link to={`/breeds/${r.breed.id}`} className="font-bold text-napier-dark underline">{r.breed.name}</Link>
                    <Badge tone={r.label === 'Good fit' ? 'green' : r.label === 'Possible' ? 'yellow' : 'red'}>{r.label}</Badge>
                  </div>
                  <ul className="mt-1.5 space-y-0.5 text-sm">
                    {r.pros.map((p) => <li key={p} className="text-napier-dark">+ {p}</li>)}
                    {r.cons.map((c) => <li key={c} className="text-murram-dark">- {c}</li>)}
                  </ul>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted">This looks only at goal, heat, feed and management. It cannot see disease risk in your area, availability or price. Ask your extension officer before buying.</p>
          </div>
        )}
      </Card>

      {picked.length >= 2 && (
        <div className="mb-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <caption className="sr-only">Breed comparison</caption>
            <thead><tr className="border-b border-line bg-napier-tint"><th className="p-3">&nbsp;</th>{picked.map((b) => <th key={b.id} className="p-3 font-bold">{b.name}</th>)}</tr></thead>
            <tbody>
              {[
                ['Main purpose', (b: typeof picked[number]) => b.purposes.map((p) => PURPOSE_LABEL[p]).join(', ')],
                ['Type', (b: typeof picked[number]) => TYPE_LABEL[b.type]],
                ['Size', (b: typeof picked[number]) => b.size],
                ['Heat tolerance', (b: typeof picked[number]) => HEAT[b.heat]],
                ['Feed quality needed', (b: typeof picked[number]) => NEED[b.feedDemand]],
                ['Management needed', (b: typeof picked[number]) => NEED[b.management]],
                ['Main limits', (b: typeof picked[number]) => b.limits[0]],
              ].map(([label, get]) => (
                <tr key={label as string} className="border-b border-line last:border-0 align-top">
                  <th scope="row" className="p-3 font-semibold text-muted">{label as string}</th>
                  {picked.map((b) => <td key={b.id} className="p-3">{(get as (b: typeof picked[number]) => string)(b)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {compare.length === 1 && <p className="mb-3 text-sm text-muted">Pick at least one more breed to compare (up to 3).</p>}

      <ul className="space-y-3">
        {list.map((b) => (
          <li key={b.id} className="rounded-2xl border border-line bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link to={`/breeds/${b.id}`} className="text-lg font-bold text-humus hover:underline">{b.name}</Link>
                <div className="mt-1 flex flex-wrap gap-1.5"><Badge tone="green">{b.purposes.map((p) => PURPOSE_LABEL[p]).join(', ')}</Badge><Badge tone="blue">{TYPE_LABEL[b.type]}</Badge></div>
              </div>
              <label className="flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold">
                <input type="checkbox" className="size-5 accent-napier" checked={compare.includes(b.id)} onChange={() => toggle(b.id)} disabled={!compare.includes(b.id) && compare.length >= 3} />
                Compare
              </label>
            </div>
            <p className="mt-2 text-muted">{b.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

