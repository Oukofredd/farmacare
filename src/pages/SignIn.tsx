import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Button, Callout, Card, Field, PageHeader, inputCls } from '../components/ui'
import { signIn } from '../lib/auth'

/** Signs in to the local demo account saved in this browser. */
export default function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = (location.state as { from?: string } | null)?.from ?? '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  /** Checks the local account credentials and returns to the requested page. */
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(email, password)
      navigate(returnTo, { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not sign in.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Sign in" subtitle="Return to your farm register and animal records." />
      <Callout tone="info" title="Local account">
        This frontend prototype uses an account saved in this browser. It is not an online account.
      </Callout>
      <Card className="mt-4">
        <form onSubmit={submit} className="grid gap-4">
          <Field label="Email address">
            <input className={inputCls} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password">
            <input className={inputCls} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          {error && <p className="text-sm font-semibold text-murram-dark" role="alert">{error}</p>}
          <Button type="submit" block disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Button>
          <p className="text-center text-sm text-muted">Use the account you registered on this device.</p>
        </form>
      </Card>
    </div>
  )
}
