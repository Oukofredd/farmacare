import { Link } from 'react-router'
import { Icon, PageHeader, ReviewBadge } from '../components/ui'

const ITEMS = [
  { to: '/breeds', t: 'Breed library', d: 'Compare breeds against your own goals, climate and feed.', i: 'book' },
  { to: '/genetics', t: 'Genetics and breeding', d: 'Purebred, crossbred, hybrid, selective breeding and GMO explained.', i: 'tree' },
  { to: '/feeding', t: 'Feeding and nutrition', d: 'Guides by species and life stage, plus common feeds.', i: 'leaf' },
  { to: '/health', t: 'Health and care', d: 'Prevention, warning signs, welfare and food safety.', i: 'heart' },
  { to: '/myths', t: 'Myths and facts', d: 'Check what you have heard against the evidence.', i: 'help' },
  { to: '/glossary', t: 'Glossary', d: 'Plain-language farming, vet and genetics terms.', i: 'search' },
]

/** Presents the learning section and links to educational topics. */
export default function Learn() {
  return (
    <div>
      <PageHeader title="Learn" subtitle="Practical guidance in plain language. Saved guides work offline." action={<ReviewBadge />} />
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
