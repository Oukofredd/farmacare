import { useParams } from 'react-router'
import { Badge, BookmarkButton, Callout, Card, PageHeader, ReviewBadge, Section, VetNote } from '../components/ui'
import { PURPOSE_LABEL, TYPE_LABEL, getBreed } from '../data/breeds'
import { getSpecies } from '../data/species'

const LEVEL = ['', 'Low', 'Medium', 'High']

/** Displays the selected breed's traits, strengths, limits, and fit notes. */
export default function BreedDetail() {
  const { id = '' } = useParams()
  const b = getBreed(id)
  if (!b) return <PageHeader title="Breed not found" back={{ to: '/breeds', label: 'Breed library' }} />
  const sp = getSpecies(b.species)
  return (
    <div>
      <PageHeader title={b.name} subtitle={b.summary} back={{ to: '/breeds', label: 'Breed library' }} action={<BookmarkButton id={`breed:${b.id}`} />} />
      <div className="mb-6 flex flex-wrap gap-1.5">
        <Badge tone="green">{b.purposes.map((p) => PURPOSE_LABEL[p]).join(', ')}</Badge>
        <Badge tone="blue">{TYPE_LABEL[b.type]}</Badge>
        <Badge>{sp.name.replace(/s$/, '')}</Badge>
        <ReviewBadge />
      </div>

      <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        {[['Origin', b.origin], ['Size', b.size], ['Production', b.production], ['Heat tolerance', LEVEL[b.heat]], ['Feed quality needed', LEVEL[b.feedDemand]], ['Management needed', LEVEL[b.management]]].map(([k, v]) => (
          <div key={k} className="bg-white p-3.5"><dt className="text-sm text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>
        ))}
      </dl>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card><h2 className="font-bold text-napier-dark">Strengths</h2><ul className="mt-2 list-disc space-y-1 pl-5">{b.strengths.map((s) => <li key={s}>{s}</li>)}</ul></Card>
        <Card><h2 className="font-bold text-murram-dark">Limitations</h2><ul className="mt-2 list-disc space-y-1 pl-5">{b.limits.map((s) => <li key={s}>{s}</li>)}</ul></Card>
      </div>

      <Section title="About the evidence">
        <Callout tone="warn" title="Check before you buy">{b.evidenceNote}</Callout>
      </Section>
      {b.type === 'hybrid' && (
        <div className="mt-4"><Callout tone="info" title="Hybrid, not GMO">Commercial hybrids are made by conventional breeding. Their own offspring usually do not match the parents, so buy new stock from a reliable supplier.</Callout></div>
      )}
      <div className="mt-6"><VetNote /></div>
    </div>
  )
}
