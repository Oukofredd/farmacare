import { Link } from 'react-router'
import type { Advisory } from '../lib/advisories'
import { Icon } from './ui'

const STYLE = {
  urgent: { bar: 'bg-murram', chip: 'bg-murram-tint text-murram-dark', label: 'Act now' },
  soon: { bar: 'bg-tag', chip: 'bg-sun-tint text-sun-ink', label: 'Coming up' },
  info: { bar: 'bg-rift', chip: 'bg-rift-tint text-rift', label: 'Good to know' },
}

/** Displays reminders in priority order with links to related records. */
export default function AdvisoryList({ items }: { items: Advisory[] }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
      {items.map((a) => {
        const s = STYLE[a.level]
        const body = (
          <div className="flex gap-3 p-4">
            <span className={`w-1.5 shrink-0 self-stretch rounded-full ${s.bar}`} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${s.chip}`}>{s.label}</span>
              <p className="mt-1 font-bold">{a.title}</p>
              <p className="mt-0.5 text-[0.95rem] text-muted">{a.detail}</p>
            </div>
            {a.href && <Icon name="right" className="mt-1 size-5 shrink-0 text-muted" />}
          </div>
        )
        return (
          <li key={a.id}>
            {a.href ? (
              <Link to={a.href} className="block hover:bg-napier-tint/50">{body}</Link>
            ) : (
              body
            )}
          </li>
        )
      })}
    </ul>
  )
}
