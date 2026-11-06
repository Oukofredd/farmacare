import { Link } from 'react-router'
import AdvisoryList from '../components/AdvisoryList'
import { Badge, Button, Card, EarTag, Icon, LinkButton, Section } from '../components/ui'
import { sampleDb } from '../data/sample'
import { SPECIES } from '../data/species'
import { buildAdvisories } from '../lib/advisories'
import { diffDays, formatDay, seasonFor, todayISO } from '../lib/dates'
import { useForecast, useInstall } from '../lib/hooks'
import { buildSchedule } from '../lib/schedule'
import { replaceDb, useDb } from '../lib/store'
import { useAuth } from '../lib/auth'

/** Shows the farm overview, key reminders, season note, and learning links. */
export default function Home() {
  const { member } = useAuth()
  const db = useDb()
  const today = todayISO()
  const season = seasonFor(today)
  const { forecast } = useForecast(member ? db.farm.lat : undefined, member ? db.farm.lng : undefined, member ? db.farm.county : '')
  const { can, install } = useInstall()

  if (!member) {
    return (
      <section className="rounded-3xl bg-napier p-6 text-white md:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-white/80">Welcome to Farmacare</p>
        <h1 className="mt-2 max-w-xl text-3xl font-extrabold leading-tight md:text-4xl">Keep your farm records in one place.</h1>
        <p className="mt-3 max-w-xl text-white/90">Create a local account to register your farm and add animal records. You can browse the learning guides without signing in.</p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <LinkButton to="/register" variant="tag">Register</LinkButton>
          <LinkButton to="/login" variant="secondary">Log in</LinkButton>
          <Link to="/learn" className="inline-flex min-h-11 items-center px-3 font-semibold text-white underline">Browse learning guides</Link>
        </div>
        <p className="mt-4 text-sm text-white/80">This frontend prototype keeps its account and farm records in this browser only.</p>
      </section>
    )
  }

  const active = db.animals.filter((a) => a.status === 'active')
  const advisories = buildAdvisories(db, today, forecast)
  const urgentCount = advisories.filter((a) => a.level === 'urgent').length
  const upcoming = buildSchedule(db, today).filter((i) => i.kind !== 'withdrawal' && diffDays(today, i.date) >= 0 && diffDays(today, i.date) <= 30).slice(0, 6)
  const bySpecies = SPECIES.map((s) => ({ s, n: active.filter((a) => a.species === s.id).reduce((t, a) => t + (a.count || 1), 0) })).filter((x) => x.n > 0)

  return (
    <div>
      <header className="mb-6">
        <p className="text-sm font-semibold text-muted">{formatDay(today)}</p>
        <h1 className="mt-0.5 text-3xl font-extrabold md:text-4xl">{db.farm.name || 'Your farm'}</h1>
        {db.farm.county && <p className="text-muted">{db.farm.county} County</p>}
      </header>

      {active.length === 0 ? (
        <section className="rounded-3xl bg-napier p-6 text-white md:p-8">
          <div className="mb-5"><EarTag tag="KB-101" size="lg" animate /></div>
          <h2 className="max-w-md text-3xl font-extrabold leading-tight">Every animal gets a tag. Every tag gets a history.</h2>
          <p className="mt-3 max-w-md text-white/90">
            Record births, vaccinations and breeding. Know when a birth is due. Learn what is true about breeds, feeds and diseases, with or without a signal.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <LinkButton to="/animals/new" variant="tag" icon="plus">Add your first animal</LinkButton>
            <Button variant="secondary" onClick={() => replaceDb(sampleDb(today))}>Explore a sample farm</Button>
          </div>
          <p className="mt-4 text-sm text-white/80">Your records stay on this device under your account. They do not sync online.</p>
        </section>
      ) : (
        <div className="flex flex-wrap gap-2.5" aria-label="Animals on the farm">
          {bySpecies.map(({ s, n }) => (
            <Link key={s.id} to={`/animals?species=${s.id}`} className="inline-flex items-baseline gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 hover:bg-napier-tint">
              <b className="font-display text-2xl font-extrabold">{n}</b>
              <span className="text-sm font-semibold text-muted">{n === 1 ? s.name.replace(/s$/, '') : s.name}</span>
            </Link>
          ))}
        </div>
      )}

      {active.length > 0 && (
        <Section
          title={urgentCount ? `Needs attention (${urgentCount} urgent)` : 'Needs attention'}
          action={advisories.length > 4 ? <Link to="/saved" className="text-sm font-semibold text-napier-dark">All reminders</Link> : undefined}
        >
          {advisories.length ? (
            <AdvisoryList items={advisories.slice(0, 5)} />
          ) : (
            <Card><p className="font-semibold">All clear.</p><p className="text-muted">No reminders, withdrawal periods or overdue births right now.</p></Card>
          )}
        </Section>
      )}

      {active.length > 0 && (
        <Section title="Coming up in the next 30 days">
          {upcoming.length ? (
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
              {upcoming.map((i) => (
                <li key={i.id}>
                  <Link to={`/animals/${i.animalId}?tab=${i.kind === 'recheck' ? 'health' : 'breeding'}`} className="flex items-center gap-3 p-3.5 hover:bg-napier-tint/50">
                    <span className="w-20 shrink-0 text-sm font-bold text-napier-dark">{formatDay(i.date)}</span>
                    <span className="min-w-0 flex-1 truncate">{i.title}</span>
                    {i.estimated && <Badge tone="yellow">Estimate</Badge>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Card><p className="text-muted">Nothing scheduled. Record a breeding or a vaccination follow-up and it will show here.</p></Card>
          )}
        </Section>
      )}

      <Section title="This season">
        <Card className="border-l-4 border-l-rift">
          <p className="font-bold">{season.name}</p>
          <p className="mt-1 text-muted">{season.note}</p>
          <p className="mt-2 text-sm text-muted">General national pattern. Timing varies by region, so check KMD forecasts for your area.</p>
          <div className="mt-3">
            {forecast ? (
              <p className="text-sm font-semibold">
                {forecast.place}: {Math.round(forecast.current.temp)}°C now, up to {Math.round(forecast.days[0].max)}°C today.{' '}
                <Link to="/weather" className="text-napier-dark underline">See forecast</Link>
              </p>
            ) : (
              <Link to="/weather" className="inline-flex items-center gap-1.5 text-sm font-semibold text-napier-dark underline">
                <Icon name="pin" className="size-4" />Set your location for weather advice
              </Link>
            )}
          </div>
        </Card>
      </Section>

      <Section title="Learn">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { to: '/genetics', t: 'Purebred, crossbred, hybrid, GMO', d: 'What each word really means.', i: 'tree' },
            { to: '/myths', t: 'Myths and facts', d: 'Check a claim before you act on it.', i: 'help' },
            { to: '/feeding', t: 'Feeding by age and stage', d: 'From newborns to laying hens.', i: 'leaf' },
          ].map((x) => (
            <Link key={x.to} to={x.to} className="rounded-2xl border border-line bg-white p-4 hover:bg-napier-tint">
              <Icon name={x.i} className="size-6 text-napier" />
              <p className="mt-2 font-bold leading-snug">{x.t}</p>
              <p className="mt-0.5 text-sm text-muted">{x.d}</p>
            </Link>
          ))}
        </div>
      </Section>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <LinkButton to="/calculator" variant="secondary" icon="calendar">Birth and hatch calculator</LinkButton>
        {can && <Button variant="ghost" icon="download" onClick={install}>Install Farmacare</Button>}
      </div>
    </div>
  )
}
