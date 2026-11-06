import { Link } from 'react-router'
import AdvisoryList from '../components/AdvisoryList'
import { EmptyState, Icon, PageHeader, Section } from '../components/ui'
import { resolveBookmark } from '../data'
import { buildAdvisories } from '../lib/advisories'
import { todayISO } from '../lib/dates'
import { useForecast } from '../lib/hooks'
import { toggleBookmark, useDb } from '../lib/store'

/** Lists saved learning items and the farm's current reminders. */
export default function Saved() {
  const db = useDb()
  const { forecast } = useForecast(db.farm.lat, db.farm.lng, db.farm.county)
  const saved = db.bookmarks.map(resolveBookmark).filter((x) => x !== null)
  const reminders = buildAdvisories(db, todayISO(), forecast)

  return (
    <div>
      <PageHeader title="Saved guides" subtitle="Your bookmarked guides stay available on this device. The app caches its files automatically for offline use." />

      <Section title="Saved guides">
        {saved.length === 0 ? (
          <EmptyState title="No saved guides yet" body="Use the Save button on a breed, feeding guide, genetics term or myth to keep it here.">
            <Link to="/learn" className="inline-flex min-h-11 items-center rounded-xl bg-napier px-4 font-semibold text-white">Browse guides</Link>
          </EmptyState>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {saved.map((s) => (
              <li key={s.id} className="flex items-center gap-2 pr-2">
                <Link to={s.href} className="flex min-w-0 flex-1 items-center gap-3 p-4 hover:bg-napier-tint/50">
                  <div className="min-w-0 flex-1"><p className="text-sm text-muted">{s.kind}</p><p className="truncate font-bold">{s.title}</p></div>
                  <Icon name="right" className="size-5 text-muted" />
                </Link>
                <button type="button" aria-label={`Remove ${s.title} from saved`} onClick={() => toggleBookmark(s.id)} className="grid size-10 place-items-center rounded-lg text-muted hover:bg-murram-tint hover:text-murram-dark"><Icon name="trash" className="size-4.5" /></button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="All reminders">
        {reminders.length ? <AdvisoryList items={reminders} /> : <p className="text-muted">No reminders right now.</p>}
      </Section>
    </div>
  )
}
