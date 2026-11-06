import { useParams } from 'react-router'
import { Badge, BookmarkButton, Callout, Card, PageHeader, ReviewBadge } from '../components/ui'
import { MYTHS, VERDICT_LABEL } from '../data/myths'
import { CONTENT_STATUS } from '../data/sources'

const TONE = { myth: 'red', fact: 'green', partly: 'yellow' } as const
const EVIDENCE = { strong: 'Strong. Widely agreed.', moderate: 'Moderate. Good support, some variation.', limited: 'Limited. Needs more local evidence.' }

/** Shows the explanation and practical context for one selected claim. */
export default function MythDetail() {
  const { id } = useParams()
  const m = MYTHS.find((x) => x.id === id)
  if (!m) return <PageHeader title="Claim not found" back={{ to: '/myths', label: 'Myths and facts' }} />
  return (
    <div>
      <PageHeader title={`“${m.claim}”`} back={{ to: '/myths', label: 'Myths and facts' }} action={<BookmarkButton id={`myth:${m.id}`} />} />
      <div className="mb-5 flex flex-wrap gap-1.5"><Badge tone={TONE[m.verdict]}>{VERDICT_LABEL[m.verdict]}</Badge><Badge>{m.topic}</Badge><ReviewBadge /></div>
      <div className="space-y-4">
        <Card><h2 className="font-bold">What the evidence says</h2><p className="mt-1 max-w-prose">{m.explanation}</p></Card>
        <Callout tone="ok" title="What to do on your farm">{m.practical}</Callout>
        <Card>
          <dl className="grid gap-3 text-[0.95rem] sm:grid-cols-2">
            <div><dt className="font-bold">Evidence quality</dt><dd className="text-muted">{EVIDENCE[m.evidence]}</dd></div>
            <div><dt className="font-bold">Source area</dt><dd className="text-muted">{m.sourceHint}</dd></div>
            <div><dt className="font-bold">Review status</dt><dd className="text-muted">{CONTENT_STATUS.version}. Not yet reviewed by a veterinarian.</dd></div>
          </dl>
        </Card>
      </div>
    </div>
  )
}
