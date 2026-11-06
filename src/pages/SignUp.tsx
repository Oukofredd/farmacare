import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Button, Callout, Card, Check, Field, PageHeader, inputCls } from '../components/ui'
import { COUNTIES, findCounty } from '../data/counties'
import { signUp } from '../lib/auth'
import { setFarm } from '../lib/store'

/** Creates the local demo account and records the age and terms confirmations. */
export default function SignUp() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = (location.state as { from?: string } | null)?.from ?? '/'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [county, setCounty] = useState('')
  const [confirmsAdult, setConfirmsAdult] = useState(false)
  const [acceptsTerms, setAcceptsTerms] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  /** Validates the registration form and saves its local account. */
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Use a password with at least 8 characters.')
      return
    }
    setBusy(true)
    try {
      await signUp({ name, email, password, confirmsAdult, acceptsTerms })
      const selectedCounty = findCounty(county)
      setFarm({ county, ...(selectedCounty ? { lat: selectedCounty.lat, lng: selectedCounty.lng, gps: false } : {}) })
      navigate(returnTo, { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not create the local account.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Create an account" subtitle="Register to manage your farm and animal records." />
      <Callout tone="info" title="Local account">
        Accounts and farm records stay on this device and do not sync across devices.
      </Callout>
      <Card className="mt-4">
        <form onSubmit={submit} className="grid gap-4">
          <Field label="Your name">
            <input className={inputCls} autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email address">
            <input className={inputCls} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Farm county">
            <select className={inputCls} required value={county} onChange={(e) => setCounty(e.target.value)}>
              <option value="">Choose your county</option>
              {COUNTIES.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
            </select>
          </Field>
          <Field label="Password" hint="At least 8 characters. This prototype stores a salted password hash on this device.">
            <input className={inputCls} type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <section className="rounded-xl border border-line bg-chalk p-3" aria-labelledby="guidelines-heading">
            <h2 id="guidelines-heading" className="mb-2 font-bold">Registration guidelines</h2>
            <Check checked={confirmsAdult} onChange={setConfirmsAdult}>I confirm that I am 18 years of age or older.</Check>
            <Check checked={acceptsTerms} onChange={setAcceptsTerms}>I have read and accept the <Link className="font-semibold text-napier-dark underline" to="/terms">Terms and Conditions</Link>.</Check>
          </section>
          {error && <p className="text-sm font-semibold text-murram-dark" role="alert">{error}</p>}
          <Button type="submit" block disabled={busy || !confirmsAdult || !acceptsTerms}>{busy ? 'Creating account…' : 'Sign up'}</Button>
          <p className="text-center text-sm text-muted">Already registered? <Link className="font-semibold text-napier-dark underline" to="/login" state={location.state}>Sign in</Link></p>
        </form>
      </Card>
    </div>
  )
}
