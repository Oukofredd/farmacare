import { LinkButton, PageHeader } from '../components/ui'

/** Shows a recovery page when the requested route does not exist. */
export default function NotFound() {
  return (
    <div>
      <PageHeader title="Page not found" subtitle="That address does not exist in Farmacare." />
      <LinkButton to="/">Go to Home</LinkButton>
    </div>
  )
}
