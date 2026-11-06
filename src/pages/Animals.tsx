import { Link, useSearchParams } from 'react-router'
import { Badge, EarTag, EmptyState, Icon, LinkButton, PageHeader } from '../components/ui'
import { breedLabel } from '../data/breeds'
import { SPECIES } from '../data/species'
import { ageText, todayISO } from '../lib/dates'
import { buildSchedule } from '../lib/schedule'
import { useDb } from '../lib/store'
import type { SpeciesId } from '../types'

/** Lists registered animals and lets the farmer search and filter the register. */
export default function Animals() {
  const db = useDb()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const species = (params.get('species') ?? '') as SpeciesId | ''
  const showAll = params.get('all') === '1'
  const verify = params.get('filter') === 'verify'
  const today = todayISO()
  const schedule = buildSchedule(db, today)

  /** Updates one search or filter value in the current URL. */
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(params)
    if (v) n.set(k, v)
    else n.delete(k)
    setParams(n, { replace: true })
  }

  const list = db.animals
    .filter((a) => (showAll ? true : a.status === 'active'))
    .filter((a) => !species || a.species === species)
    .filter((a) => !verify || a.source === 'unknown' || a.geneticStatus === 'unknown')
    .filter((a) => {
      if (!q.trim()) return true
      const hay = `${a.tag} ${a.name ?? ''} ${breedLabel(a.breedId)}`.toLowerCase()
      return hay.includes(q.trim().toLowerCase())
    })
    .sort((a, b) => a.tag.localeCompare(b.tag, undefined, { numeric: true }))

  return (
    <div>
      <PageHeader
        title="Animal register"
        subtitle={`${db.animals.filter((a) => a.status === 'active').length} active records on this device`}
        action={<LinkButton to="/animals/new" icon="plus">Add animal</LinkButton>}
      />

      {db.animals.length > 0 && (
        <div className="mb-4 space-y-3">
          <label className="relative block">
            <span className="sr-only">Search animals</span>
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={q}
              onChange={(e) => set('q', e.target.value)}
              placeholder="Search by tag, name or breed"
              className="block min-h-11 w-full rounded-xl border border-line bg-white py-2 pl-10 pr-3"
            />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by species">
            {[{ id: '', name: 'All' }, ...SPECIES.map((s) => ({ id: s.id, name: s.name }))].map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={species === s.id}
                onClick={() => set('species', s.id)}
                className={`min-h-10 rounded-full border px-3.5 text-sm font-semibold ${species === s.id ? 'border-transparent bg-napier text-white' : 'border-line bg-white hover:bg-napier-tint'}`}
              >
                {s.name}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={showAll}
              onClick={() => set('all', showAll ? '' : '1')}
              className={`min-h-10 rounded-full border px-3.5 text-sm font-semibold ${showAll ? 'border-transparent bg-humus text-white' : 'border-line bg-white hover:bg-napier-tint'}`}
            >
              Include sold and deceased
            </button>
          </div>
          {verify && (
            <p className="text-sm font-semibold text-sun-ink">
              Showing animals with unknown source or genetic status.{' '}
              <button type="button" className="underline" onClick={() => set('filter', '')}>Show all</button>
            </p>
          )}
        </div>
      )}

      {db.animals.length === 0 ? (
        <EmptyState title="No animals yet" body="Add an animal to start its history: tag, breed, birth date, parents, health and breeding.">
          <LinkButton to="/animals/new" icon="plus">Add your first animal</LinkButton>
        </EmptyState>
      ) : list.length === 0 ? (
        <EmptyState title="No animals match" body="Try a different search or clear the filters." />
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {list.map((a) => {
            const items = schedule.filter((i) => i.animalId === a.id)
            const due = items.find((i) => i.kind === 'due')
            const withdrawal = items.find((i) => i.kind === 'withdrawal')
            const sp = SPECIES.find((s) => s.id === a.species)!
            return (
              <li key={a.id}>
                <Link to={`/animals/${a.id}`} className="flex items-center gap-3 p-3.5 hover:bg-napier-tint/50">
                  <div className="w-28 shrink-0"><EarTag tag={a.tag} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{a.name || breedLabel(a.breedId)}{a.count > 1 && <span className="font-normal text-muted"> ({a.count})</span>}</p>
                    <p className="truncate text-sm text-muted">
                      {sp.name.replace(/s$/, '')}{a.name ? `, ${breedLabel(a.breedId)}` : ''}, {a.sex === 'unknown' ? 'sex unknown' : a.sex}, {ageText(a.dob, today)}
                      {a.dob && a.dobEstimated ? ' (estimated)' : ''}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {a.status !== 'active' && <Badge tone="neutral">{a.status === 'sold' ? 'Sold' : 'Deceased'}</Badge>}
                      {withdrawal && <Badge tone="red">Withdrawal period</Badge>}
                      {due && <Badge tone={due.overdue ? 'red' : 'yellow'}>{sp.birthWord} {due.overdue ? 'overdue' : 'expected'}</Badge>}
                      {a.geneticStatus === 'unknown' && <Badge tone="neutral">Genetics unknown</Badge>}
                    </div>
                  </div>
                  <Icon name="right" className="size-5 shrink-0 text-muted" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
