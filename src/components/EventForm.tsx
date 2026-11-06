import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Callout, Field, inputCls } from './ui'
import { DISEASES } from '../data/health'
import { getSpecies } from '../data/species'
import { todayISO } from '../lib/dates'
import { buildPlan } from '../lib/lifecycle'
import { checkPairing } from '../lib/relations'
import { openBreedings } from '../lib/schedule'
import { addEvent, updateAnimal, useDb } from '../lib/store'
import type { Animal, EventType, WithdrawalFor } from '../types'

export const EVENT_LABEL: Record<EventType, string> = {
  vaccination: 'Vaccination',
  treatment: 'Treatment',
  illness: 'Illness or symptoms observed',
  breeding: 'Breeding (mating, AI or eggs set)',
  birth: 'Birth or hatching',
  weight: 'Weight',
  production: 'Production (milk or eggs)',
  transfer: 'Sale, purchase or movement',
  note: 'Note',
}

/** Renders and saves a new health, breeding, weight, or note event. */
export default function EventForm({
  animal, types, initial, linkedId, onDone,
}: { animal: Animal; types: EventType[]; initial?: EventType; linkedId?: string; onDone: () => void }) {
  const db = useDb()
  const sp = getSpecies(animal.species)
  const today = todayISO()
  const [type, setType] = useState<EventType>(initial ?? types[0])
  const [f, setF] = useState({
    date: today, title: '', details: '', professional: '', value: '', unit: sp.productionUnits[0]?.unit ?? 'kg',
    nextDue: '', withdrawalDays: '', withdrawalFor: 'milk_and_meat' as WithdrawalFor,
    partnerTag: '', method: 'natural' as 'natural' | 'ai' | 'unknown', linkedId: linkedId ?? '', statusAfter: '' as '' | 'sold' | 'deceased',
  })
  const [err, setErr] = useState('')
  /** Updates one typed field in the event form state. */
  const up = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }))

  const open = openBreedings(db.events, animal.id)
  const warnings = type === 'breeding' && animal.species !== 'chicken' ? checkPairing(animal, f.partnerTag, db.animals) : []
  const diseaseNames = DISEASES.filter((d) => d.species.includes(animal.species)).map((d) => d.name)
  const needsValue = type === 'weight' || type === 'production'

  /** Validates the entered event and passes it to the parent save handler. */
  function submit(e: FormEvent) {
    e.preventDefault()
    if (f.date > today && type !== 'vaccination') { setErr('This date is in the future. Record events once they have happened.'); return }
    if (needsValue && !(Number(f.value) > 0)) { setErr('Enter a number greater than zero.'); return }
    let title = f.title.trim()
    if (!title) {
      if (type === 'weight') title = 'Weight'
      else if (type === 'production') title = animal.species === 'chicken' ? 'Eggs collected' : 'Milk'
      else if (type === 'breeding') title = animal.species === 'chicken' ? 'Eggs set' : f.method === 'ai' ? 'Mated (AI)' : 'Mated'
      else if (type === 'birth') title = sp.kind === 'incubation' ? 'Hatched' : sp.birthWord
      else { setErr('Add a short title so you can find this later.'); return }
    }
    const base = { animalId: animal.id, type, date: f.date, title, details: f.details.trim() || undefined, professional: f.professional.trim() || undefined }
    if (type === 'vaccination' || type === 'treatment') {
      const wd = Number(f.withdrawalDays)
      addEvent({ ...base, nextDue: f.nextDue || undefined, ...(type === 'treatment' && wd > 0 ? { withdrawalDays: wd, withdrawalFor: f.withdrawalFor } : {}) })
    } else if (type === 'breeding') {
      addEvent({ ...base, partnerTag: f.partnerTag.trim() || undefined, method: animal.species === 'chicken' ? undefined : f.method, value: f.value ? Number(f.value) : undefined, unit: animal.species === 'chicken' ? 'eggs' : undefined, expectedDue: buildPlan(animal.species, f.date).due, pregnancy: animal.species === 'chicken' ? undefined : 'unconfirmed' })
    } else if (type === 'birth') {
      addEvent({ ...base, value: f.value ? Number(f.value) : undefined, unit: 'born', linkedId: f.linkedId || undefined })
    } else if (needsValue) {
      addEvent({ ...base, value: Number(f.value), unit: type === 'weight' ? 'kg' : f.unit })
    } else {
      addEvent(base)
      if (type === 'transfer' && f.statusAfter) updateAnimal(animal.id, { status: f.statusAfter })
    }
    onDone()
  }

  return (
    <form onSubmit={submit} noValidate className="mb-6 space-y-4 rounded-2xl border-2 border-napier/30 bg-white p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {types.length > 1 && (
          <Field label="What happened?">
            <select className={inputCls} value={type} onChange={(e) => setType(e.target.value as EventType)}>
              {types.map((t) => <option key={t} value={t}>{EVENT_LABEL[t]}</option>)}
            </select>
          </Field>
        )}
        <Field label="Date">
          <input type="date" className={inputCls} value={f.date} onChange={(e) => up('date', e.target.value)} />
        </Field>
      </div>

      {type !== 'weight' && type !== 'production' && (
        <Field
          label={type === 'vaccination' ? 'Disease or vaccine' : type === 'treatment' ? 'Medicine or treatment' : type === 'illness' ? 'What did you see?' : 'Title'}
          hint={type === 'treatment' ? 'Use the product name and what it was for.' : undefined}
        >
          <input className={inputCls} list={type === 'vaccination' ? 'disease-list' : undefined} value={f.title} onChange={(e) => up('title', e.target.value)} />
          <datalist id="disease-list">{diseaseNames.map((n) => <option key={n} value={n} />)}</datalist>
        </Field>
      )}

      {(needsValue || (type === 'breeding' && animal.species === 'chicken') || type === 'birth') && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={type === 'weight' ? 'Weight (kg)' : type === 'production' ? 'Amount' : type === 'birth' ? `Number of ${sp.young}s born` : 'Number of eggs set'}>
            <input type="number" inputMode="decimal" min={0} step="any" className={inputCls} value={f.value} onChange={(e) => up('value', e.target.value)} />
          </Field>
          {type === 'production' && sp.productionUnits.length > 0 && (
            <Field label="Unit">
              <select className={inputCls} value={f.unit} onChange={(e) => up('unit', e.target.value)}>
                {sp.productionUnits.map((u) => <option key={u.unit} value={u.unit}>{u.label}</option>)}
              </select>
            </Field>
          )}
        </div>
      )}

      {type === 'breeding' && animal.species !== 'chicken' && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Male or semen used" hint="Pick a tag from your register, or type a name.">
              <input className={inputCls} list="partner-list" value={f.partnerTag} onChange={(e) => up('partnerTag', e.target.value)} />
              <datalist id="partner-list">
                {db.animals.filter((a) => a.species === animal.species && a.sex === 'male').map((a) => <option key={a.id} value={a.tag} />)}
              </datalist>
            </Field>
            <Field label="Method">
              <select className={inputCls} value={f.method} onChange={(e) => up('method', e.target.value as 'natural' | 'ai' | 'unknown')}>
                <option value="natural">Natural mating</option>
                <option value="ai">Artificial insemination</option>
                <option value="unknown">Not sure</option>
              </select>
            </Field>
          </div>
          {warnings.map((w, i) => (
            <Callout key={i} tone={w.level === 'high' ? 'danger' : w.level === 'moderate' ? 'warn' : 'info'} title={w.level === 'info' ? 'Relationship check' : 'Close relationship'}>{w.text}</Callout>
          ))}
        </>
      )}

      {type === 'birth' && open.length > 0 && (
        <Field label="Which breeding was this from?" hint="This closes the pregnancy so it stops appearing in reminders.">
          <select className={inputCls} value={f.linkedId} onChange={(e) => up('linkedId', e.target.value)}>
            <option value="">Not linked</option>
            {open.map((o) => <option key={o.id} value={o.id}>{o.title} on {o.date}</option>)}
          </select>
        </Field>
      )}

      {(type === 'vaccination' || type === 'treatment') && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Next due (optional)" hint="Creates a reminder.">
            <input type="date" className={inputCls} value={f.nextDue} onChange={(e) => up('nextDue', e.target.value)} />
          </Field>
          {type === 'treatment' && (
            <>
              <Field label="Withdrawal period (days)" hint="From the label or your vet. Leave empty if none.">
                <input type="number" min={0} inputMode="numeric" className={inputCls} value={f.withdrawalDays} onChange={(e) => up('withdrawalDays', e.target.value)} />
              </Field>
              <Field label="Do not sell or eat">
                <select className={inputCls} value={f.withdrawalFor} onChange={(e) => up('withdrawalFor', e.target.value as WithdrawalFor)}>
                  <option value="milk_and_meat">Milk and meat</option>
                  <option value="milk">Milk</option>
                  <option value="meat">Meat</option>
                  <option value="eggs">Eggs</option>
                </select>
              </Field>
            </>
          )}
        </div>
      )}

      {(type === 'vaccination' || type === 'treatment' || type === 'illness' || type === 'breeding') && (
        <Field label="Vet or animal health worker (optional)" hint="Leave empty and the record shows as a farmer observation.">
          <input className={inputCls} value={f.professional} onChange={(e) => up('professional', e.target.value)} />
        </Field>
      )}

      {type === 'transfer' && (
        <Field label="Update animal status">
          <select className={inputCls} value={f.statusAfter} onChange={(e) => up('statusAfter', e.target.value as '' | 'sold' | 'deceased')}>
            <option value="">Keep as active</option>
            <option value="sold">Mark as sold or moved off the farm</option>
            <option value="deceased">Mark as deceased</option>
          </select>
        </Field>
      )}

      <Field label="Details (optional)">
        <textarea className={`${inputCls} min-h-20`} value={f.details} onChange={(e) => up('details', e.target.value)} />
      </Field>

      {err && <p className="text-sm font-semibold text-murram-dark" role="alert">{err}</p>}
      <div className="flex gap-3">
        <button type="submit" className="inline-flex min-h-11 items-center rounded-xl bg-napier px-5 font-semibold text-white hover:bg-napier-dark">Save record</button>
        <Button variant="secondary" onClick={onDone}>Cancel</Button>
      </div>
    </form>
  )
}
