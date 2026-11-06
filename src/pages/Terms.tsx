import { Link } from 'react-router'
import { PageHeader, Section } from '../components/ui'

/** Presents the current draft terms linked from the registration form. */
export default function Terms() {
  return (
    <div>
      <PageHeader title="Terms and Conditions" subtitle="Draft terms for the Farmacare frontend prototype." />
      <p className="mb-6 rounded-xl border border-line bg-white p-4 text-sm text-muted">
        These draft terms describe the current prototype and should be reviewed and finalized before public release.
      </p>
      <Section title="Using Farmacare">
        <p>Farmacare helps farmers organize animal and farm information and explore general educational content. You agree to provide information you are entitled to record and to use the app lawfully.</p>
      </Section>
      <Section title="Age and account">
        <p>You must be at least 18 years old to create an account in this prototype. During sign-up, you confirm your age and acceptance of these terms.</p>
      </Section>
      <Section title="Farm records and device storage">
        <p>This frontend prototype keeps its account and farm records in the browser on the device being used. It does not provide server accounts, cloud backup, or cross-device synchronization. You are responsible for keeping backups of records you need.</p>
      </Section>
      <Section title="Educational information">
        <p>Breed, feeding, health, weather, and breeding information is general education. It is not a diagnosis, prescription, or substitute for advice from a veterinarian or qualified animal health worker. Seek professional help when an animal is ill or in urgent need.</p>
      </Section>
      <Section title="Availability and changes">
        <p>The prototype is provided for learning and evaluation. Features, information, and availability may change as the project develops.</p>
      </Section>
      <p className="mt-8 text-sm"><Link className="font-semibold text-napier-dark underline" to="/register">Return to registration</Link></p>
    </div>
  )
}
