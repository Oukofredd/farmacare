import { useState } from 'react'
import { Link } from 'react-router'
import { Badge, Icon, PageHeader, ReviewBadge } from '../components/ui'
import { MYTHS, VERDICT_LABEL } from '../data/myths'
import type { MythTopic, Verdict } from '../data/myths'

export const VERDICT_TONE = { myth: 'red', fact: 'green', partly: 'yellow' } as const
const TOPICS: (MythTopic | 'All')[] = ['All', 'Genetics and breeds', 'Breeding', 'Feeding', 'Health and medicine', 'Food safety']

/** Lets farmers search and filter common livestock claims and explanations. */
export default function Myths() {
  const [q, setQ] = useState('')
  const [topic, setTopic] = useState<MythTopic | 'All'>('All')
  const [verdict, setVerdict] = useState<Verdict | 'all'>('all')
  const list = MYTHS.filter((m) => (topic === 'All' || m.topic === topic) && (verdict === 'all' || m.verdict === verdict) &&
    (!q.trim() || `${m.claim} ${m.explanation}`.toLowerCase().includes(q.trim().toLowerCase())))
  return (
    <div>
      <PageHeader title="Myths and facts" subtitle="Check a claim before you spend money or change how you care for animals." action={<ReviewBadge />} />
      <div className="mb-5 space-y-3">
        <label className="relative block">
          <span className="sr-only">Search claims</span>
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search, for example hormones or colostrum" className="block min-h-11 w-full rounded-xl border border-line bg-white py-2 pl-10 pr-3" />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Topic">
          {TOPICS.map((t) => (
            <button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(t)}
              className={`min-h-10 rounded-full border px-3.5 text-sm font-semibold ${topic === t ? 'border-transparent bg-napier text-white' : 'border-line bg-white hover:bg-napier-tint'}`}>{t}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Verdict">
          {(['all', 'myth', 'partly', 'fact'] as const).map((v) => (
            <button key={v} type="button" aria-pressed={verdict === v} onClick={() => setVerdict(v)}
              className={`min-h-10 rounded-full border px-3.5 text-sm font-semibold ${verdict === v ? 'border-transparent bg-humus text-white' : 'border-line bg-white hover:bg-napier-tint'}`}>{v === 'all' ? 'Any verdict' : VERDICT_LABEL[v]}</button>
          ))}
        </div>
      </div>
      {list.length === 0 ? <p className="text-muted">No claims match. Try fewer words or another topic.</p> : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {list.map((m) => (
            <li key={m.id}>
              <Link to={`/myths/${m.id}`} className="flex items-start gap-3 p-4 hover:bg-napier-tint/50">
                <div className="min-w-0 flex-1">
                  <p className="font-bold">“{m.claim}”</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5"><Badge tone={VERDICT_TONE[m.verdict]}>{VERDICT_LABEL[m.verdict]}</Badge><Badge>{m.topic}</Badge></div>
                </div>
                <Icon name="right" className="mt-1 size-5 shrink-0 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
