import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Badge, Button, Callout, Card, Field, PageHeader, VetNote, inputCls } from '../components/ui'
import { SPECIES, getSpecies } from '../data/species'
import { diffDays, formatDate, formatDay, relativeDays, todayISO } from '../lib/dates'
import { buildPlan } from '../lib/lifecycle'
import { addEvent, useDb } from '../lib/store'
import type { SpeciesId } from '../types'

/** Calculates estimated birth or hatch dates and milestone reminders. */
export default function Calculator() {
  const db = useDb()
  const [params] = useSearchParams()
  const today = todayISO()
  const pre = db.animals.find((a) => a.id === params.get('animal'))
  const [species, setSpecies] = useState<SpeciesId>(pre?.species ?? 'cattle')
  const [start, setStart] = useState(today)
  const [animalId, setAnimalId] = useState(pre?.id ?? '')
  const [saved, setSaved] = useState(false)
  const sp = getSpecies(species)
  const valid = !!start && start <= today
  const plan = valid ? buildPlan(species, start) : null
  const candidates = db.animals.filter((a) => a.species === species && a.sex !== 'male' && a.status === 'active')
  const since = diffDays(start, today)

  /** Saves the calculated breeding or setting event to the chosen animal. */
  function save() {
    const a = candidates.find((x) => x.id === animalId)
    if (!a || !plan) return
    addEvent({
      animalId: a.id, type: 'breeding', date: start,
      title: sp.kind === 'incubation' ? 'Eggs set' : 'Mated',
      expectedDue: plan.due, pregnancy: sp.kind === 'incubation' ? undefined : 'unconfirmed',
      method: sp.kind === 'incubation' ? undefined : 'unknown',
    })
    setSaved(true)
  }

  return (
    <div>
      <PageHeader title="Birth and hatch calculator" subtitle="Estimate when to expect a birth or hatch, and what to prepare along the way. Works offline and needs no account." />
      <Card className="mb-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Species">
            <select className={inputCls} value={species} onChange={(e) => { setSpecies(e.target.value as SpeciesId); setAnimalId(''); setSaved(false) }}>
              {SPECIES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label={sp.startLabel}>
            <input type="date" className={inputCls} value={start} max={today} onChange={(e) => { setStart(e.target.value); setSaved(false) }} />
          </Field>
        </div>
        <p className="mt-3 text-sm text-muted">{sp.summary}</p>
      </Card>

      {!plan ? (
        <Callout tone="warn" title="Check the date">Enter the date the animal was bred, or the eggs were set. It cannot be in the future.</Callout>
      ) : (
        <div className="space-y-6">
          <section className="rounded-3xl bg-napier p-5 text-white md:p-7" aria-live="polite">
            <div className="flex flex-wrap items-center gap-2"><Badge tone="yellow">Estimate</Badge><span className="text-sm text-white/85">{sp.kind === 'incubation' ? 'Hatch' : sp.birthWord} expected</span></div>
            <p className="mt-2 font-display text-4xl font-extrabold md:text-5xl">{formatDate(plan.due)}</p>
            <p className="mt-1 text-lg text-white/90">{since < 0 ? '' : relativeDays(plan.due, today)}{since >= 0 ? '. ' : ''}Day {Math.max(0, since)} of about {sp.days}.</p>
            <p className="mt-3 text-white/90">Likely window: {formatDay(plan.earliest)} to {formatDay(plan.latest)}.</p>
          </section>

          {plan.nextHeat && (
            <Callout tone="info" title="If she is not pregnant">
              She would usually return to heat between {formatDay(plan.nextHeat.from)} and {formatDay(plan.nextHeat.to)}. Not returning to heat is a good sign, but only a vet's check confirms pregnancy.
            </Callout>
          )}

          <section>
            <h2 className="mb-3 text-xl font-bold">What to do and when</h2>
            <ol className="space-y-3 border-l-2 border-line pl-4">
              {plan.items.map((m) => (
                <li key={m.day}>
                  <p className="text-sm font-bold text-napier-dark">{formatDay(m.date)}, day {m.day}</p>
                  <p className="font-semibold">{m.label}</p>
                  <p className="text-[0.95rem] text-muted">{m.detail}</p>
                </li>
              ))}
              <li><p className="text-sm font-bold text-napier-dark">{formatDay(plan.due)}, day {sp.days}</p><p className="font-semibold">Average due date</p></li>
            </ol>
          </section>

          <Card>
            <h2 className="text-lg font-bold">Save to an animal</h2>
            {candidates.length ? (
              <div className="mt-2 flex flex-wrap items-end gap-3">
                <label className="block text-sm font-semibold">Animal
                  <select className={`${inputCls} w-64`} value={animalId} onChange={(e) => { setAnimalId(e.target.value); setSaved(false) }}>
                    <option value="">Choose an animal</option>
                    {candidates.map((a) => <option key={a.id} value={a.id}>{a.tag}{a.name ? ` (${a.name})` : ''}</option>)}
                  </select>
                </label>
                <Button disabled={!animalId || saved} onClick={save}>{saved ? 'Saved' : 'Save as a breeding record'}</Button>
              </div>
            ) : <p className="mt-1 text-muted">No {sp.plural} in your register yet. <Link to="/animals/new" className="font-semibold text-napier-dark underline">Add an animal</Link> to save this and get reminders.</p>}
            {saved && animalId && <p className="mt-2 text-sm font-semibold text-napier-dark">Saved. <Link className="underline" to={`/animals/${animalId}?tab=breeding`}>Open the breeding tab</Link></p>}
          </Card>

          <Card><p className="font-semibold">When to start breeding</p><p className="mt-1 text-muted">{sp.firstBreeding}</p></Card>
          <Callout tone="warn" title="These dates are estimates">Pregnancy and incubation length vary with breed, the individual, litter size and temperature. Treat the dates as a guide, and watch the animal. Call a vet if you see signs of trouble.</Callout>
          <VetNote />
        </div>
      )}
    </div>
  )
}


