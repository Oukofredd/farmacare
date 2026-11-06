import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Button, Callout, Check, Field, PageHeader, inputCls } from '../components/ui'
import { BREEDS } from '../data/breeds'
import { SPECIES } from '../data/species'
import { todayISO } from '../lib/dates'
import { checkParentage } from '../lib/relations'
import { addAnimal, updateAnimal, useDb } from '../lib/store'
import type { Animal, GeneticStatus, Sex, SourceType, SpeciesId } from '../types'

const GENETIC_OPTIONS: { id: GeneticStatus; label: string }[] = [
  { id: 'unknown', label: 'Unknown (not sure)' },
  { id: 'purebred_documented', label: 'Purebred, with a certificate or registry record' },
  { id: 'purebred_claimed', label: 'Purebred, claimed but not verified' },
  { id: 'crossbred', label: 'Crossbred (two or more breeds)' },
  { id: 'grade_upgraded', label: 'Graded up from local stock' },
  { id: 'commercial_hybrid', label: 'Commercial hybrid (hatchery line)' },
]

/** Creates a new animal record or edits an existing animal. */
export default function AnimalForm() {
  const { id } = useParams()
  const db = useDb()
  const nav = useNavigate()
  const existing = id ? db.animals.find((a) => a.id === id) : undefined
  const today = todayISO()

  const [f, setF] = useState(() => ({
    tag: existing?.tag ?? '',
    name: existing?.name ?? '',
    species: (existing?.species ?? db.prefs.species[0] ?? 'cattle') as SpeciesId,
    breedId: existing?.breedId ?? 'unknown',
    sex: (existing?.sex ?? 'female') as Sex,
    count: String(existing?.count ?? 1),
    dob: existing?.dob ?? '',
    dobEstimated: existing?.dobEstimated ?? false,
    source: (existing?.source ?? 'unknown') as SourceType,
    sourceDetail: existing?.sourceDetail ?? '',
    sireTag: existing?.sireTag ?? '',
    damTag: existing?.damTag ?? '',
    pedigreeVerified: existing?.pedigreeVerified ?? false,
    geneticStatus: (existing?.geneticStatus ?? 'unknown') as GeneticStatus,
    notes: existing?.notes ?? '',
  }))
  const [errors, setErrors] = useState<Record<string, string>>({})
  /** Updates one typed field in the animal form state. */
  const up = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }))

  if (id && !existing) {
    return (
      <div>
        <PageHeader title="Animal not found" back={{ to: '/animals', label: 'Animal register' }} />
        <p className="text-muted">This record may have been deleted or is on another device.</p>
      </div>
    )
  }

  const breeds = BREEDS.filter((b) => b.species === f.species)
  const others = db.animals.filter((a) => a.id !== id)
  const tagsForSpecies = others.filter((a) => a.species === f.species)
  const parentageWarnings = checkParentage(f.sireTag, f.damTag, f.species, others)

  /** Validates form values and saves the animal record. */
  function submit(e: FormEvent) {
    e.preventDefault()
    const err: Record<string, string> = {}
    const tag = f.tag.trim()
    if (!tag) err.tag = 'Enter a tag or ID. It can be a number, a code or a name you will recognise.'
    else if (others.some((a) => a.tag.trim().toLowerCase() === tag.toLowerCase())) err.tag = 'Another animal already uses this tag. Tags must be unique.'
    if (f.dob && f.dob > today) err.dob = 'The birth date cannot be in the future.'
    const count = Number(f.count)
    if (!Number.isInteger(count) || count < 1) err.count = 'Enter 1 for one animal, or the number in the group.'
    setErrors(err)
    if (Object.keys(err).length) return

    const data: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'> = {
      tag,
      name: f.name.trim() || undefined,
      species: f.species,
      breedId: f.breedId,
      sex: f.sex,
      count,
      dob: f.dob || undefined,
      dobEstimated: f.dob ? f.dobEstimated : false,
      source: f.source,
      sourceDetail: f.sourceDetail.trim() || undefined,
      sireTag: f.sireTag.trim() || undefined,
      damTag: f.damTag.trim() || undefined,
      pedigreeVerified: (f.sireTag.trim() || f.damTag.trim()) ? f.pedigreeVerified : false,
      geneticStatus: f.geneticStatus,
      status: existing?.status ?? 'active',
      notes: f.notes.trim() || undefined,
    }
    if (existing) {
      updateAnimal(existing.id, data)
      nav(`/animals/${existing.id}`)
    } else {
      const a = addAnimal(data)
      nav(`/animals/${a.id}`)
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <PageHeader
        title={existing ? 'Edit animal' : 'Add animal'}
        subtitle="Only record what you know. Anything you leave unknown is shown as unknown, never guessed."
        back={{ to: existing ? `/animals/${existing.id}` : '/animals', label: existing ? 'Back to profile' : 'Animal register' }}
      />

      <fieldset className="space-y-4">
        <legend className="mb-1 text-xl font-bold">Identity</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tag or ID (required)" error={errors.tag} hint="Written on the ear tag or herd book.">
            <input className={inputCls} value={f.tag} onChange={(e) => up('tag', e.target.value)} autoCapitalize="characters" />
          </Field>
          <Field label="Name (optional)">
            <input className={inputCls} value={f.name} onChange={(e) => up('name', e.target.value)} />
          </Field>
          <Field label="Species">
            <select className={inputCls} value={f.species} onChange={(e) => setF((p) => ({ ...p, species: e.target.value as SpeciesId, breedId: 'unknown' }))}>
              {SPECIES.map((s) => <option key={s.id} value={s.id}>{s.name.replace(/s$/, '')}</option>)}
            </select>
          </Field>
          <Field label="Breed">
            <select className={inputCls} value={f.breedId} onChange={(e) => up('breedId', e.target.value)}>
              <option value="unknown">Unknown</option>
              <option value="mixed">Mixed or crossbred</option>
              {breeds.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </Field>
          <Field label="Sex">
            <select className={inputCls} value={f.sex} onChange={(e) => up('sex', e.target.value as Sex)}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="unknown">Unknown or mixed group</option>
            </select>
          </Field>
          <Field label="Number in this record" error={errors.count} hint="1 for one animal. Use more for a flock or a litter group.">
            <input className={inputCls} type="number" min={1} inputMode="numeric" value={f.count} onChange={(e) => up('count', e.target.value)} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-8 space-y-4">
        <legend className="mb-1 text-xl font-bold">Age and source</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date of birth or hatching" error={errors.dob}>
            <input className={inputCls} type="date" max={today} value={f.dob} onChange={(e) => up('dob', e.target.value)} />
          </Field>
          <div className="self-end">
            <Check checked={f.dobEstimated} onChange={(v) => up('dobEstimated', v)}>This date is an estimate</Check>
          </div>
          <Field label="Where did it come from?">
            <select className={inputCls} value={f.source} onChange={(e) => up('source', e.target.value as SourceType)}>
              <option value="unknown">Unknown</option>
              <option value="born_on_farm">Born on this farm</option>
              <option value="purchased">Purchased</option>
              <option value="gift">Gift or inherited</option>
            </select>
          </Field>
          <Field label="Source details (optional)" hint="Seller, farm of origin or hatchery.">
            <input className={inputCls} value={f.sourceDetail} onChange={(e) => up('sourceDetail', e.target.value)} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-8 space-y-4">
        <legend className="mb-1 text-xl font-bold">Parents and genetic status</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Sire (father) tag" hint="Leave empty if unknown.">
            <input className={inputCls} list="sire-tags" value={f.sireTag} onChange={(e) => up('sireTag', e.target.value)} />
          </Field>
          <Field label="Dam (mother) tag" hint="Leave empty if unknown.">
            <input className={inputCls} list="dam-tags" value={f.damTag} onChange={(e) => up('damTag', e.target.value)} />
          </Field>
          <datalist id="sire-tags">{tagsForSpecies.filter((a) => a.sex !== 'female').map((a) => <option key={a.id} value={a.tag} />)}</datalist>
          <datalist id="dam-tags">{tagsForSpecies.filter((a) => a.sex !== 'male').map((a) => <option key={a.id} value={a.tag} />)}</datalist>
        </div>
        {(f.sireTag || f.damTag) && (
          <Check checked={f.pedigreeVerified} onChange={(v) => up('pedigreeVerified', v)}>
            I have a certificate, registry entry or farm record that confirms these parents
          </Check>
        )}
        {parentageWarnings.map((w, i) => (
          <Callout key={i} tone={w.level === 'high' ? 'danger' : 'warn'} title="Check the parentage">{w.text}</Callout>
        ))}
        <Field
          label="Genetic status"
          hint={<>Not sure? <Link to="/genetics#checker" className="font-semibold text-napier-dark underline">Use the genetic status checker</Link>. Looks alone cannot show purity or GMO status.</>}
        >
          <select className={inputCls} value={f.geneticStatus} onChange={(e) => up('geneticStatus', e.target.value as GeneticStatus)}>
            {GENETIC_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </Field>
      </fieldset>

      <div className="mt-8">
        <Field label="Notes (optional)">
          <textarea className={`${inputCls} min-h-24`} value={f.notes} onChange={(e) => up('notes', e.target.value)} />
        </Field>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-napier px-5 font-semibold text-white hover:bg-napier-dark">
          {existing ? 'Save changes' : 'Save animal'}
        </button>
        <Button variant="secondary" onClick={() => nav(existing ? `/animals/${existing.id}` : '/animals')}>Cancel</Button>
      </div>
    </form>
  )
}
