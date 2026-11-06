import { Link } from 'react-router'
import { Icon, PageHeader } from '../components/ui'

const ITEMS = [
  { to: '/weather', t: 'Weather and farm planning', d: 'Forecast, seasons, soil and water.', i: 'sun' },
  { to: '/saved', t: 'Saved guides and reminders', d: 'Your bookmarked learning guides and farm reminders.', i: 'bookmark' },
  { to: '/settings', t: 'Settings and data', d: 'Farm details, backup, export and delete.', i: 'sliders' },
  { to: '/sources', t: 'Sources, review and privacy', d: 'Where content comes from and how data is handled.', i: 'shield' },
  { to: '/glossary', t: 'Glossary', d: 'Plain-language terms.', i: 'search' },
]

/** Collects secondary navigation links and device-specific options. */
export default function More() {
  return (
    <div>
      <PageHeader title="More" />
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {ITEMS.map((x) => (
          <li key={x.to}>
            <Link to={x.to} className="flex items-center gap-4 p-4 hover:bg-napier-tint/50">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-napier-tint text-napier-dark"><Icon name={x.i} className="size-6" /></span>
              <span className="min-w-0 flex-1"><span className="block font-bold">{x.t}</span><span className="text-sm text-muted">{x.d}</span></span>
              <Icon name="right" className="size-5 text-muted" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
