import { useState } from 'react'
import { PageHeader, Icon } from '../components/ui'
import { GLOSSARY } from '../data/glossary'

/** Searches and displays definitions from the livestock glossary. */
export default function Glossary() {
  const [q, setQ] = useState('')
  const list = GLOSSARY.filter((t) => `${t.term} ${t.meaning}`.toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <div>
      <PageHeader title="Glossary" subtitle="Farming, vet and genetics words in plain language." back={{ to: '/learn', label: 'Learn' }} />
      <label className="relative mb-4 block">
        <span className="sr-only">Search terms</span>
        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms" className="block min-h-11 w-full rounded-xl border border-line bg-white py-2 pl-10 pr-3" />
      </label>
      <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {list.map((t) => <div key={t.id} className="p-4"><dt className="font-bold">{t.term}</dt><dd className="text-muted">{t.meaning}</dd></div>)}
      </dl>
    </div>
  )
}
