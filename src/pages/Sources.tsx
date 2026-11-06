import { Callout, Card, PageHeader, Section } from '../components/ui'
import { CONTENT_STATUS, SOURCES } from '../data/sources'

/** Explains the app's evidence, review, and data-privacy approach. */
export default function Sources() {
  return (
    <div>
      <PageHeader title="Sources, review and privacy" subtitle="How Farmacare treats evidence, uncertainty and your data." />

      <Section title="About Farmacare">
        <p className="max-w-prose">Farmacare helps livestock and poultry farmers keep animal records, plan breeding, and learn reliable feeding, health and breed information, including offline. It supports decisions. It does not replace a veterinarian, a laboratory test or an extension officer.</p>
      </Section>

      <Section title="Content review status">
        <Callout tone="warn" title={`${CONTENT_STATUS.version}: pending expert review`}>
          {CONTENT_STATUS.label} Until qualified veterinary and nutrition professionals review each guide, treat the content as general education. Every entry will later show its reviewer and review date.
        </Callout>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Calculated dates are estimates based on average gestation and incubation lengths, and are labelled as estimates.</li>
          <li>Unknown history, parentage or genetic status is shown as unknown, never filled in.</li>
          <li>The app gives no drug doses and no precise rations.</li>
          <li>Breed figures are indicative and need checking against KALRO and breed society data.</li>
        </ul>
      </Section>

      <Section title="Reference organisations">
        <p className="mb-3 text-muted">Content is being aligned with guidance from these organisations. Specific documents will be cited, with permissions checked, once content is reviewed.</p>
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {SOURCES.map((s) => (
            <li key={s.id} className="p-4">
              <p className="font-bold">{s.short}</p>
              <p className="text-sm text-muted">{s.name}</p>
              <p className="mt-1">{s.covers}</p>
              {s.url && <a href={s.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm font-semibold text-napier-dark underline">{s.url.replace('https://', '')}</a>}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Getting expert help">
        <Card>
          <p>For illness, injuries, difficult births, medicines or suspected notifiable disease, contact:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Your sub-county veterinary officer or a registered veterinarian</li>
            <li>The county agriculture and livestock office, or your extension officer</li>
            <li>KALRO for research-based breed and feeding advice</li>
          </ul>
          <p className="mt-2 text-sm text-muted">Local contact numbers will be added once verified.</p>
        </Card>
      </Section>

      <Section title="Privacy and data controls">
        <ul className="list-disc space-y-2 pl-5">
          <li><b>What is stored:</b> your farm details, animal records, saved guides and settings.</li>
          <li><b>Where:</b> only in this browser on this device. There are no accounts and no upload in this version.</li>
          <li><b>Location:</b> optional. A county choice is enough. GPS is used only if you tap the button and give permission, and is stored on this device.</li>
          <li><b>What leaves the device:</b> if you open the weather screen, the coordinates of your county town or saved location are sent to Open-Meteo to get a forecast. Nothing else is sent.</li>
          <li><b>No tracking or advertising</b> is built into this version.</li>
          <li><b>Your controls:</b> download a backup, export CSV, or delete everything from Settings.</li>
          <li><b>Before accounts and sync launch,</b> data handling will be reviewed against Kenya's Data Protection Act, 2019, with access control, encryption and backups.</li>
        </ul>
      </Section>

      <Section title="Help">
        <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {[
            ['Will my records disappear?', 'They stay until you delete them or clear this browser\'s data. Download a backup regularly.'],
            ['Can I use it with no signal?', 'Yes. After the first visit online, the app, your records and saved guides work offline. Weather needs a connection, and the last forecast is kept.'],
            ['Can I install it?', 'Yes. Use your browser\'s "Install" or "Add to Home screen" option, or the Install button when it appears.'],
            ['Why does it say "estimate"?', 'Animals vary. Dates are calculated from average lengths and can be a few days out.'],
          ].map(([q, a]) => <div key={q} className="p-4"><dt className="font-bold">{q}</dt><dd className="text-muted">{a}</dd></div>)}
        </dl>
      </Section>
    </div>
  )
}
