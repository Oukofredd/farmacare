import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import EventForm, { EVENT_LABEL } from '../components/EventForm'
import { Badge, Button, Callout, Card, EarTag, EmptyState, Icon, LinkButton, Meter, PageHeader, Section, Tabs } from '../components/ui'
import { breedLabel } from '../data/breeds'
import { suggestFeeding } from '../data/feeding'
import { getSpecies } from '../data/species'
import { ageInMonths, ageText, diffDays, formatDate, formatDay, relativeDays, todayISO } from '../lib/dates'
import { buildPlan } from '../lib/lifecycle'
import { recordQuality } from '../lib/quality'
import { offspringOf } from '../lib/relations'
import { buildSchedule, openBreedings } from '../lib/schedule'
import { deleteAnimal, deleteEvent, updateAnimal, updateEvent, useDb } from '../lib/store'
import type { Animal, AnimalEvent, EventType, GeneticStatus, PregnancyState } from '../types'

type TabId = 'overview' | 'history' | 'health' | 'breeding' | 'production'
const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'history', label: 'History' },
  { id: 'health', label: 'Health' },
  { id: 'breeding', label: 'Breeding' },
  { id: 'production', label: 'Growth and production' },
]

const GENETIC_LABEL: Record<GeneticStatus, { text: string; tone: 'green' | 'yellow' | 'neutral' | 'blue' }> = {
  unknown: { text: 'Genetic status unknown', tone: 'neutral' },
  purebred_documented: { text: 'Purebred, documented', tone: 'green' },
  purebred_claimed: { text: 'Purebred, not verified', tone: 'yellow' },
  crossbred: { text: 'Crossbred', tone: 'blue' },
  grade_upgraded: { text: 'Graded up', tone: 'blue' },
  commercial_hybrid: { text: 'Commercial hybrid', tone: 'blue' },
}
const SOURCE_LABEL = { born_on_farm: 'Born on this farm', purchased: 'Purchased', gift: 'Gift or inherited', unknown: 'Unknown' }

type Adding = { types: EventType[]; initial?: EventType; linkedId?: string }

type AddItem = { label: string; types: EventType[]; initial: EventType }

/** Shows shortcuts for adding common events to an animal's history. */
function AddBar({ items, onAdd }: { items: AddItem[]; onAdd: (a: Adding) => void }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {items.map((i) => <Button key={i.label} variant="secondary" icon="plus" onClick={() => onAdd({ types: i.types, initial: i.initial })}>{i.label}</Button>)}
    </div>
  )
}

/** Displays one recorded event with its date and relevant details. */
function EventRow({ ev }: { ev: AnimalEvent }) {
  const detail = [
    ev.value !== undefined && ev.type !== 'breeding' && ev.type !== 'birth' ? `${ev.value} ${ev.unit ?? ''}` : '',
    ev.type === 'birth' && ev.value ? `${ev.value} born` : '',
    ev.partnerTag ? `Partner: ${ev.partnerTag}` : '',
    ev.withdrawalDays ? `Withdrawal ${ev.withdrawalDays} days` : '',
    ev.nextDue ? `Next due ${formatDate(ev.nextDue)}` : '',
  ].filter(Boolean).join(', ')
  return (
    <li className="flex gap-3 p-3.5">
      <div className="w-24 shrink-0 text-sm font-bold text-napier-dark">{formatDate(ev.date)}</div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{ev.title}</p>
        <p className="text-sm text-muted">{EVENT_LABEL[ev.type].split(' (')[0]}{detail ? `, ${detail}` : ''}</p>
        {ev.details && <p className="mt-0.5 text-[0.95rem]">{ev.details}</p>}
        {['vaccination', 'treatment', 'illness'].includes(ev.type) && (
          <p className="mt-1">{ev.professional ? <Badge tone="green">Assessed by {ev.professional}</Badge> : <Badge tone="neutral">Farmer observation</Badge>}</p>
        )}
      </div>
      <button type="button" aria-label={`Delete record ${ev.title}`} className="grid size-10 shrink-0 place-items-center rounded-lg text-muted hover:bg-murram-tint hover:text-murram-dark"
        onClick={() => { if (window.confirm('Delete this record? This cannot be undone.')) deleteEvent(ev.id) }}>
        <Icon name="trash" className="size-4.5" />
      </button>
    </li>
  )
}

/** Renders an event history list or its explanatory empty state. */
function EventList({ events, empty }: { events: AnimalEvent[]; empty: string }) {
  if (!events.length) return <EmptyState title="Nothing recorded yet" body={empty} />
  return <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">{events.map((e) => <EventRow key={e.id} ev={e} />)}</ul>
}

/** Plots recorded animal weights as a small labelled SVG chart. */
function WeightChart({ points }: { points: { date: string; v: number }[] }) {
  if (points.length < 2) return null
  const W = 320, H = 120, P = 24
  const xs = points.map((p) => diffDays(points[0].date, p.date))
  const maxX = Math.max(...xs, 1)
  const minV = Math.min(...points.map((p) => p.v)), maxV = Math.max(...points.map((p) => p.v))
  const span = maxV - minV || 1
  /** Converts a weight point into its x/y position in the chart viewbox. */
  const pt = (p: { date: string; v: number }, i: number) => `${P + (xs[i] / maxX) * (W - 2 * P)},${H - P - ((p.v - minV) / span) * (H - 2 * P)}`
  const coords = points.map(pt)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Weight from ${points[0].v} to ${points[points.length - 1].v} kilograms`}>
      <polyline points={coords.join(' ')} fill="none" stroke="var(--color-napier)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {coords.map((c, i) => <circle key={i} cx={c.split(',')[0]} cy={c.split(',')[1]} r="4.5" fill="var(--color-tag)" stroke="var(--color-humus)" strokeWidth="1.5" />)}
      <text x={P} y={H - 4} fontSize="10" fill="var(--color-muted)">{formatDate(points[0].date)}</text>
      <text x={W - P} y={H - 4} fontSize="10" textAnchor="end" fill="var(--color-muted)">{formatDate(points[points.length - 1].date)}</text>
      <text x={P} y={12} fontSize="10" fill="var(--color-muted)">{maxV} kg</text>
    </svg>
  )
}

/** Shows identity, parentage, and record-completeness details for an animal. */
function Overview({ a }: { a: Animal }) {
  const db = useDb()
  const nav = useNavigate()
  const today = todayISO()
  const q = recordQuality(a, db.events)
  const sire = db.animals.find((x) => x.tag === a.sireTag && x.species === a.species)
  const dam = db.animals.find((x) => x.tag === a.damTag && x.species === a.species)
  const kids = offspringOf(a, db.animals)
  const mine = db.events.filter((e) => e.animalId === a.id)
  const pregnant = a.species !== 'chicken' && openBreedings(db.events, a.id).length > 0
  const sp = getSpecies(a.species)
  const lactWindow = a.species === 'pig' ? 28 : 300
  const lactating = a.sex === 'female' && a.species !== 'chicken' && mine.some((e) => e.type === 'birth' && diffDays(e.date, today) <= lactWindow)
  const feed = suggestFeeding(a.species, a.dob ? ageInMonths(a.dob, today) : undefined, a.sex, pregnant, lactating)

  return (
    <div className="space-y-8">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Record quality</h2>
          <span className="font-display text-2xl font-extrabold">{q.percent}%</span>
        </div>
        <div className="mt-2"><Meter percent={q.percent} /></div>
        {q.missing.length > 0 ? (
          <details className="mt-3">
            <summary className="cursor-pointer text-sm font-semibold text-napier-dark">What would improve this ({q.missing.length})</summary>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.95rem] text-muted">{q.missing.map((m) => <li key={m.key}>{m.text}</li>)}</ul>
          </details>
        ) : <p className="mt-2 text-sm text-muted">Complete. Every field is recorded.</p>}
      </Card>

      <Section title="Identity">
        <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {[
            ['Species', sp.name.replace(/s$/, '')],
            ['Breed', breedLabel(a.breedId)],
            ['Sex', a.sex === 'unknown' ? 'Unknown or mixed group' : a.sex],
            ['Born', a.dob ? `${formatDate(a.dob)}${a.dobEstimated ? ' (estimated)' : ''}` : 'Unknown'],
            ['Source', `${SOURCE_LABEL[a.source]}${a.sourceDetail ? `: ${a.sourceDetail}` : ''}`],
            ['Parentage', a.sireTag || a.damTag ? (a.pedigreeVerified ? 'Documented' : 'Recorded, not verified') : 'Unknown'],
          ].map(([k, v]) => (
            <div key={k} className="bg-white p-3.5"><dt className="text-sm text-muted">{k}</dt><dd className="font-semibold first-letter:uppercase">{v}</dd></div>
          ))}
        </dl>
      </Section>

      <Section title="Pedigree">
        {a.sireTag || a.damTag ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[['Sire (father)', a.sireTag, sire], ['Dam (mother)', a.damTag, dam]].map(([label, tag, rec]) => (
              <Card key={label as string}>
                <p className="text-sm text-muted">{label as string}</p>
                {tag ? (rec ? <Link to={`/animals/${(rec as Animal).id}`} className="mt-1 inline-block"><EarTag tag={tag as string} /></Link> : <p className="font-semibold">{tag as string} <span className="text-sm font-normal text-muted">(not in register)</span></p>) : <p className="font-semibold text-muted">Unknown</p>}
              </Card>
            ))}
          </div>
        ) : <p className="text-muted">No parents recorded. Add them from Edit if you can confirm them.</p>}
        {kids.length > 0 && (
          <div className="mt-3"><p className="mb-1.5 text-sm font-semibold">Offspring in your register</p>
            <div className="flex flex-wrap gap-2">{kids.map((k) => <Link key={k.id} to={`/animals/${k.id}`}><EarTag tag={k.tag} /></Link>)}</div></div>
        )}
      </Section>

      {feed.length > 0 && (
        <Section title="Feeding guides that fit this animal">
          <ul className="space-y-2">
            {feed.map((s) => (
              <li key={s.guide.id}>
                <Link to={`/feeding#${s.guide.id}`} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-3.5 hover:bg-napier-tint">
                  <span><span className="block font-bold">{s.guide.title}</span><span className="text-sm text-muted">{s.guide.stage}. {s.reason}.</span></span>
                  <Icon name="right" className="size-5 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {a.notes && <Section title="Notes"><p className="whitespace-pre-wrap">{a.notes}</p></Section>}

      <div className="flex flex-wrap gap-2.5 border-t border-line pt-5">
        <LinkButton to={`/animals/${a.id}/edit`} variant="secondary" icon="edit">Edit details</LinkButton>
        {a.status === 'active' ? (
          <>
            <Button variant="secondary" onClick={() => updateAnimal(a.id, { status: 'sold' })}>Mark as sold</Button>
            <Button variant="secondary" onClick={() => updateAnimal(a.id, { status: 'deceased' })}>Mark as deceased</Button>
          </>
        ) : <Button variant="secondary" onClick={() => updateAnimal(a.id, { status: 'active' })}>Mark as active again</Button>}
        <Button variant="danger" icon="trash" onClick={() => { if (window.confirm(`Delete ${a.tag} and all its records? This cannot be undone.`)) { deleteAnimal(a.id); nav('/animals') } }}>Delete</Button>
      </div>
    </div>
  )
}

/** Combines an animal's details, events, health, breeding, and production tabs. */
export default function AnimalProfile() {
  const { id } = useParams()
  const db = useDb()
  const [params, setParams] = useSearchParams()
  const [adding, setAdding] = useState<Adding | null>(null)
  const a = db.animals.find((x) => x.id === id)
  const today = todayISO()

  if (!a) {
    return (
      <div>
        <PageHeader title="Animal not found" back={{ to: '/animals', label: 'Animal register' }} />
        <p className="text-muted">This record may have been deleted, or it may be stored on a different device.</p>
      </div>
    )
  }

  /** Reads the active profile tab from the URL, defaulting to the overview. */
  const tab = (TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'overview') as TabId
  const sp = getSpecies(a.species)
  const events = db.events.filter((e) => e.animalId === a.id).sort((x, y) => y.date.localeCompare(x.date) || y.createdAt.localeCompare(x.createdAt))
  /** Selects this animal's events whose types belong to the requested section. */
  const ofType = (...t: EventType[]) => events.filter((e) => t.includes(e.type))
  const schedule = buildSchedule(db, today).filter((i) => i.animalId === a.id)
  const withdrawals = schedule.filter((i) => i.kind === 'withdrawal')
  const open = openBreedings(db.events, a.id)
  const weights = ofType('weight').slice().reverse().map((e) => ({ date: e.date, v: e.value ?? 0 }))
  const gain = weights.length >= 2 && diffDays(weights[0].date, weights[weights.length - 1].date) > 0
    ? (weights[weights.length - 1].v - weights[0].v) / diffDays(weights[0].date, weights[weights.length - 1].date) : null
  const gen = GENETIC_LABEL[a.geneticStatus]
  const prodItems: AddItem[] = [{ label: 'Add weight', types: ['weight'], initial: 'weight' }]
  if (sp.productionUnits.length) prodItems.push({ label: 'Add production', types: ['production'], initial: 'production' })

  const form = adding && <EventForm key={`${adding.initial}-${adding.linkedId}`} animal={a} types={adding.types} initial={adding.initial} linkedId={adding.linkedId} onDone={() => setAdding(null)} />

  return (
    <>
    <div className="animal-profile-screen">
      <PageHeader title={<span className="flex flex-wrap items-center gap-3"><EarTag tag={a.tag} size="lg" animate />{a.name && <span>{a.name}</span>}</span>}
        back={{ to: '/animals', label: 'Animal register' }}
        subtitle={`${a.count > 1 ? `Group of ${a.count}. ` : ''}${breedLabel(a.breedId)}, ${sp.name.replace(/s$/, '').toLowerCase()}, ${ageText(a.dob, today)}${a.dob && a.dobEstimated ? ' (estimated)' : ''}`}
        action={<Button variant="secondary" icon="printer" onClick={() => window.print()}>Print profile</Button>} />
      <div className="-mt-2 mb-5 flex flex-wrap gap-1.5">
        <Badge tone={gen.tone}>{gen.text}</Badge>
        {a.status !== 'active' && <Badge tone="neutral">{a.status === 'sold' ? 'Sold' : 'Deceased'}</Badge>}
        {withdrawals.length > 0 && <Badge tone="red">Withdrawal period active</Badge>}
      </div>

      <Tabs label="Animal sections" tabs={TABS} value={tab} onChange={(t) => { setAdding(null); setParams({ tab: t }, { replace: true }) }} />

      {tab === 'overview' && <Overview a={a} />}

      {tab === 'history' && (
        <div>
          <AddBar onAdd={setAdding} items={[{ label: 'Add note', types: ['note'], initial: 'note' }, { label: 'Sale or movement', types: ['transfer'], initial: 'transfer' }]} />
          {form}
          <EventList events={events} empty="Vaccinations, treatments, breeding, weights and notes will appear here in order." />
          {a.dob && <p className="mt-3 text-sm text-muted">Born {formatDate(a.dob)}{a.dobEstimated ? ' (estimated)' : ''}. Record created {formatDate(a.createdAt.slice(0, 10))}.</p>}
        </div>
      )}

      {tab === 'health' && (
        <div>
          {withdrawals.map((w) => <div key={w.id} className="mb-3"><Callout tone="danger" title={w.title}>{w.detail}</Callout></div>)}
          <AddBar onAdd={setAdding} items={[
            { label: 'Vaccination', types: ['vaccination'], initial: 'vaccination' },
            { label: 'Treatment', types: ['treatment'], initial: 'treatment' },
            { label: 'Illness observed', types: ['illness'], initial: 'illness' },
          ]} />
          {form}
          <EventList events={ofType('vaccination', 'treatment', 'illness')} empty="Record vaccinations and treatments with the product and any withdrawal days. Unknown history stays unknown." />
          <p className="mt-4 text-sm"><Link to="/health" className="font-semibold text-napier-dark underline">See warning signs and when to call a vet</Link></p>
        </div>
      )}

      {tab === 'breeding' && (
        <div>
          {a.sex === 'male' ? (
            <Callout tone="info" title="Record matings on the female">Open the female's profile and record the breeding there, naming this animal as the partner. Offspring then appear on the Overview tab.</Callout>
          ) : (
            <>
              <AddBar onAdd={setAdding} items={[{ label: sp.kind === 'incubation' ? 'Eggs set' : 'Record breeding', types: ['breeding'], initial: 'breeding' }, { label: sp.kind === 'incubation' ? 'Record hatch' : `Record ${sp.birthWord.toLowerCase()}`, types: ['birth'], initial: 'birth' }]} />
              {form}
              {a.dob && ageInMonths(a.dob, today) < 6 && <div className="mb-4"><Callout tone="warn" title="Very young animal">This animal is under 6 months old. Check its age and the breeding date.</Callout></div>}
              <p className="mb-4 text-sm text-muted">{sp.firstBreeding}</p>
              {open.map((b) => {
                const plan = buildPlan(a.species, b.date)
                const due = b.expectedDue ?? plan.due
                return (
                  <Card key={b.id} className="mb-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div><p className="font-bold">{b.title}, {formatDate(b.date)}</p>{b.partnerTag && <p className="text-sm text-muted">Partner: {b.partnerTag}</p>}</div>
                      <Badge tone="yellow">Estimate</Badge>
                    </div>
                    <p className="mt-3 font-display text-3xl font-extrabold">{formatDate(due)}</p>
                    <p className="text-muted">{relativeDays(due, today)}. Likely window {formatDay(plan.earliest)} to {formatDay(plan.latest)}.</p>
                    {sp.kind === 'gestation' && (
                      <label className="mt-3 block text-sm font-semibold">Pregnancy status
                        <select className="mt-1 block min-h-11 w-full rounded-xl border border-line bg-white px-3 sm:w-72" value={b.pregnancy ?? 'unconfirmed'} onChange={(e) => updateEvent(b.id, { pregnancy: e.target.value as PregnancyState })}>
                          <option value="unconfirmed">Not yet confirmed</option>
                          <option value="confirmed">Confirmed pregnant</option>
                          <option value="not_pregnant">Not pregnant (closes this record)</option>
                        </select>
                      </label>
                    )}
                    <ol className="mt-4 space-y-2 border-l-2 border-line pl-4">
                      {plan.items.map((m) => (
                        <li key={m.day} className={diffDays(today, m.date) < 0 ? 'opacity-55' : ''}>
                          <p className="text-sm font-bold text-napier-dark">{formatDay(m.date)}</p>
                          <p className="font-semibold">{m.label}</p>
                          <p className="text-sm text-muted">{m.detail}</p>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-4"><Button variant="secondary" onClick={() => setAdding({ types: ['birth'], initial: 'birth', linkedId: b.id })}>{sp.kind === 'incubation' ? 'Record hatch' : `Record ${sp.birthWord.toLowerCase()}`}</Button></div>
                  </Card>
                )
              })}
              <h3 className="mb-2 mt-6 text-lg font-bold">Breeding history</h3>
              <EventList events={ofType('breeding', 'birth')} empty="Matings, pregnancy results and births will be listed here." />
            </>
          )}
        </div>
      )}

      {tab === 'production' && (
        <div>
          <AddBar onAdd={setAdding} items={prodItems} />
          {form}
          {weights.length >= 2 ? (
            <Card className="mb-5">
              <h3 className="font-bold">Growth</h3>
              <WeightChart points={weights} />
              {gain !== null && <p className="text-sm text-muted">Average change {gain >= 0 ? '+' : ''}{gain.toFixed(2)} kg per day between the first and last weights.</p>}
            </Card>
          ) : null}
          <EventList events={ofType('weight', 'production')} empty="Add weights to see a growth line, and milk or egg counts to track production." />
        </div>
      )}
    </div>
    <article className="animal-profile-print" aria-label="Printable animal profile">
      <header className="mb-6 border-b pb-4">
        <p className="text-sm font-semibold">Farmacare · Animal record</p>
        <h1 className="mt-1 text-3xl font-bold">{a.name ? `${a.name} — ${a.tag}` : a.tag}</h1>
        <p>Printed {formatDay(today)}{db.farm.name ? ` · ${db.farm.name}` : ''}{db.farm.county ? ` · ${db.farm.county} County` : ''}</p>
      </header>
      <section className="mb-6">
        <h2 className="mb-2 text-xl font-bold">Animal details</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2">
          <div><dt className="font-semibold">Tag</dt><dd>{a.tag}</dd></div>
          <div><dt className="font-semibold">Name</dt><dd>{a.name || 'Not recorded'}</dd></div>
          <div><dt className="font-semibold">Species</dt><dd>{sp.name.replace(/s$/, '')}</dd></div>
          <div><dt className="font-semibold">Breed</dt><dd>{breedLabel(a.breedId)}</dd></div>
          <div><dt className="font-semibold">Sex</dt><dd>{a.sex === 'unknown' ? 'Unknown' : a.sex}</dd></div>
          <div><dt className="font-semibold">Group count</dt><dd>{a.count}</dd></div>
          <div><dt className="font-semibold">Date of birth</dt><dd>{a.dob ? `${formatDate(a.dob)}${a.dobEstimated ? ' (estimated)' : ''}` : 'Unknown'}</dd></div>
          <div><dt className="font-semibold">Source</dt><dd>{SOURCE_LABEL[a.source]}{a.sourceDetail ? ` — ${a.sourceDetail}` : ''}</dd></div>
          <div><dt className="font-semibold">Sire</dt><dd>{a.sireTag || 'Unknown'}</dd></div>
          <div><dt className="font-semibold">Dam</dt><dd>{a.damTag || 'Unknown'}</dd></div>
          <div><dt className="font-semibold">Genetic status</dt><dd>{GENETIC_LABEL[a.geneticStatus].text}</dd></div>
          <div><dt className="font-semibold">Record status</dt><dd>{a.status}</dd></div>
        </dl>
        {a.notes && <p className="mt-3 whitespace-pre-wrap"><b>Notes:</b> {a.notes}</p>}
      </section>
      <section>
        <h2 className="mb-2 text-xl font-bold">History</h2>
        {events.length === 0 ? <p>No events recorded.</p> : (
          <ol className="space-y-3">
            {events.map((ev) => (
              <li key={ev.id} className="animal-print-event border-b pb-2">
                <p className="font-bold">{formatDate(ev.date)} · {EVENT_LABEL[ev.type]}: {ev.title}</p>
                {ev.details && <p>{ev.details}</p>}
                <p className="text-sm">
                  {[ev.professional && `Recorded by ${ev.professional}`, ev.value !== undefined && `Value ${ev.value}${ev.unit ? ` ${ev.unit}` : ''}`, ev.partnerTag && `Partner ${ev.partnerTag}`, ev.expectedDue && `Expected date ${formatDate(ev.expectedDue)}`, ev.nextDue && `Next due ${formatDate(ev.nextDue)}`, ev.withdrawalDays && `Withdrawal ${ev.withdrawalDays} days${ev.withdrawalFor ? ` (${ev.withdrawalFor})` : ''}`, ev.pregnancy && `Pregnancy ${ev.pregnancy}`, ev.method && `Method ${ev.method}`].filter(Boolean).join(' · ') || 'No additional details recorded.'}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </article>
    </>
  )
}
