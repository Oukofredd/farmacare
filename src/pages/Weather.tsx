import { useState } from 'react'
import AdvisoryList from '../components/AdvisoryList'
import { Badge, Button, Callout, Card, Field, PageHeader, Section, inputCls } from '../components/ui'
import { COUNTIES, findCounty } from '../data/counties'
import { weatherAdvisories } from '../lib/advisories'
import { formatDay, seasonFor, todayISO } from '../lib/dates'
import { useForecast, useOnline } from '../lib/hooks'
import { setFarm, useDb } from '../lib/store'

const SEASONS = [
  ['Long rains', 'March to May', 'Main planting and pasture growth. Higher risk of mud, foot rot, worms and ticks.'],
  ['Cool, drier months', 'June to September', 'Conserve hay and silage. Cold nights can chill young animals in the highlands.'],
  ['Short rains', 'October to December', 'Second growing season. Watch for flooding, flies and ticks.'],
  ['Hot, dry months', 'January and February', 'Water and feed get scarce. Plan shade, water and supplements.'],
]

/** Shows a local forecast and weather-related livestock reminders. */
export default function Weather() {
  const db = useDb()
  const online = useOnline()
  const { forecast, failed, loading, refresh } = useForecast(db.farm.lat, db.farm.lng, db.farm.county)
  const [geoMsg, setGeoMsg] = useState('')
  const hasPoint = db.farm.lat !== undefined && db.farm.lng !== undefined
  const adv = weatherAdvisories(db, forecast)
  const season = seasonFor(todayISO())

  /** Saves the selected county as the farm's weather location. */
  function pickCounty(name: string) {
    const c = findCounty(name)
    if (c) setFarm({ county: c.name, lat: c.lat, lng: c.lng, gps: false })
    else setFarm({ county: '', lat: undefined, lng: undefined, gps: false })
  }

  /** Gets device coordinates and stores them for a location-specific forecast. */
  function useGps() {
    if (!('geolocation' in navigator)) { setGeoMsg('This device does not support location.'); return }
    setGeoMsg('Asking for permission...')
    navigator.geolocation.getCurrentPosition(
      (p) => { setFarm({ lat: Number(p.coords.latitude.toFixed(3)), lng: Number(p.coords.longitude.toFixed(3)), gps: true }); setGeoMsg('Location saved on this device only.') },
      () => setGeoMsg('Permission was not given, so nothing was saved. You can still choose your county.'),
      { timeout: 10000, maximumAge: 600000 },
    )
  }

  return (
    <div>
      <PageHeader title="Weather and farm planning" subtitle="A general forecast for your area, with advice for the animals you keep." />

      <Card className="mb-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="County" hint="Used to fetch a general forecast.">
            <select className={inputCls} value={db.farm.county} onChange={(e) => pickCounty(e.target.value)}>
              <option value="">Choose a county</option>
              {COUNTIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </Field>
          <div className="self-end">
            <Button variant="secondary" icon="pin" onClick={useGps}>Use my device location</Button>
            {geoMsg && <p className="mt-1.5 text-sm text-muted" role="status">{geoMsg}</p>}
          </div>
        </div>
        <p className="mt-3 text-sm text-muted">Location is optional and is stored only on this device. {db.farm.gps ? 'Currently using GPS coordinates.' : ''}</p>
      </Card>

      {!hasPoint ? (
        <Callout tone="info" title="Choose a county to see the forecast">Seasonal guidance below works without a location.</Callout>
      ) : !forecast ? (
        <Callout tone={failed || !online ? 'warn' : 'info'} title={!online ? 'You are offline' : failed ? 'Forecast not available' : 'Loading forecast'}>
          {!online ? 'No saved forecast for this place yet. Connect once to save one.' : failed ? 'The weather service did not respond. Try again in a moment.' : 'Fetching the latest forecast.'}
          {online && failed && <div className="mt-2"><Button variant="secondary" onClick={refresh}>Try again</Button></div>}
        </Callout>
      ) : (
        <>
          <section className="rounded-3xl bg-rift p-5 text-white md:p-6">
            <p className="text-sm text-white/85">{forecast.place || 'Your location'}, now</p>
            <p className="font-display text-5xl font-extrabold">{Math.round(forecast.current.temp)}°C</p>
            <p className="text-white/90">Humidity {Math.round(forecast.current.humidity)}%. Rain in the last hour {forecast.current.rain} mm.</p>
          </section>
          <ul className="mt-3 grid grid-cols-5 gap-2 text-center text-sm" aria-label="Five day forecast">
            {forecast.days.map((d) => (
              <li key={d.date} className="rounded-xl border border-line bg-white p-2">
                <p className="font-semibold">{formatDay(d.date).split(' ')[0]}</p>
                <p className="font-display text-lg font-extrabold">{Math.round(d.max)}°</p>
                <p className="text-muted">{Math.round(d.min)}°</p>
                <div className="mx-auto mt-1.5 flex h-10 items-end justify-center"><div className="w-3 rounded-t bg-rift" style={{ height: `${Math.min(100, Math.max(6, d.rain * 4))}%` }} /></div>
                <p className="text-xs text-muted">{Math.round(d.rain)} mm</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted">
            {online ? 'Updated' : 'Saved copy from'} {new Date(forecast.fetchedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}.
            {online && <button type="button" onClick={refresh} disabled={loading} className="ml-2 font-semibold text-napier-dark underline">{loading ? 'Refreshing...' : 'Refresh'}</button>}
          </p>
        </>
      )}

      <Callout tone="warn" title="About this data">
        This is a general model forecast for a point near your county town, from Open-Meteo. It is not an official Kenya Meteorological Department product and may miss local conditions. For warnings, check KMD at meteo.go.ke.
      </Callout>

      {adv.length > 0 && <Section title="Advice for the next few days"><AdvisoryList items={adv} /></Section>}

      <Section title="Seasons in Kenya">
        <Callout tone="ok" title={`Now: ${season.name}`}>{season.note}</Callout>
        <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {SEASONS.map(([n, w, d]) => <li key={n} className="p-4"><p className="font-bold">{n} <span className="font-normal text-muted">({w})</span></p><p className="text-muted">{d}</p></li>)}
        </ul>
        <p className="mt-2 text-sm text-muted">A general national pattern. The coast, north and north-east differ, so rely on local KMD advice.</p>
      </Section>

      <Section title="Soil, fodder and water">
        <Card>
          <div className="mb-2"><Badge tone="yellow">Soil data not yet connected</Badge></div>
          <p>Soil texture, fertility and drainage data are not available in this version. Test your soil before choosing fodder. Your county agriculture office or KALRO can advise on soil testing.</p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.95rem]">
            <li><b>Fodder:</b> plant Napier, legumes such as desmodium, and fodder shrubs at the start of the rains. Conserve hay or silage while grass is plentiful.</li>
            <li><b>Water:</b> store rainwater where you can. Check troughs daily, and keep water clean and shaded.</li>
            <li><b>Heat:</b> provide shade, ventilation and cool water. Feed in the cool of the day, and watch for panting and drooling.</li>
          </ul>
        </Card>
      </Section>
    </div>
  )
}
