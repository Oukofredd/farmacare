import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { Button, Callout, Card, Check, Field, PageHeader, Section, inputCls } from '../components/ui'
import { COUNTIES, findCounty } from '../data/counties'
import { sampleDb } from '../data/sample'
import { SPECIES } from '../data/species'
import { todayISO } from '../lib/dates'
import { didSaveFail, download, parseBackup, replaceDb, resetDb, setFarm, setPrefs, toCsv, useDb } from '../lib/store'
import type { SpeciesId } from '../types'

/** Manages farm preferences, local data backups, and database reset actions. */
export default function Settings() {
  const db = useDb()
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<{ tone: 'ok' | 'danger'; text: string } | null>(null)
  const stamp = todayISO()

  /** Downloads the complete local database as a JSON backup. */
  function exportJson() {
    download(`farmacare-backup-${stamp}.json`, JSON.stringify(db, null, 2), 'application/json')
    setMsg({ tone: 'ok', text: 'Backup downloaded. Keep it somewhere safe, such as your email or cloud storage.' })
  }
  /** Downloads animal and event records as spreadsheet-friendly CSV files. */
  function exportCsv() {
    const tagOf = new Map(db.animals.map((a) => [a.id, a.tag]))
    download(`farmacare-animals-${stamp}.csv`, toCsv(db.animals.map((a) => ({ tag: a.tag, name: a.name, species: a.species, breed: a.breedId, sex: a.sex, count: a.count, born: a.dob, born_estimated: a.dobEstimated, source: a.source, sire: a.sireTag, dam: a.damTag, pedigree_verified: a.pedigreeVerified, genetic_status: a.geneticStatus, status: a.status }))), 'text/csv')
    download(`farmacare-events-${stamp}.csv`, toCsv(db.events.map((e) => ({ animal_tag: tagOf.get(e.animalId), date: e.date, type: e.type, title: e.title, details: e.details, assessed_by: e.professional, value: e.value, unit: e.unit, next_due: e.nextDue, withdrawal_days: e.withdrawalDays, expected_due: e.expectedDue, pregnancy: e.pregnancy }))), 'text/csv')
    setMsg({ tone: 'ok', text: 'Two CSV files downloaded: animals and events.' })
  }
  /** Reads a selected backup file and replaces the local database if valid. */
  async function importFile(file: File) {
    try {
      const next = parseBackup(await file.text())
      if (window.confirm(`Replace the records on this device with the backup (${next.animals.length} animals, ${next.events.length} events)?`)) {
        replaceDb(next)
        setMsg({ tone: 'ok', text: 'Backup restored.' })
      }
    } catch (e) {
      setMsg({ tone: 'danger', text: e instanceof Error ? e.message : 'Could not read that file.' })
    }
    if (fileRef.current) fileRef.current.value = ''
  }
  /** Adds or removes a species from the farmer's reminder preferences. */
  const toggleSpecies = (id: SpeciesId, on: boolean) => setPrefs({ species: on ? [...db.prefs.species, id] : db.prefs.species.filter((s) => s !== id) })

  return (
    <div>
      <PageHeader title="Settings and data" />
      {didSaveFail() && <div className="mb-4"><Callout tone="danger" title="Could not save to this device">Storage may be full or blocked (private browsing). Export a backup now so you do not lose records.</Callout></div>}
      {msg && <div className="mb-4"><Callout tone={msg.tone} title={msg.tone === 'ok' ? 'Done' : 'That did not work'}>{msg.text}</Callout></div>}

      <Section title="Your farm">
        <Card className="grid gap-4 sm:grid-cols-2">
          <Field label="Farm name or label"><input className={inputCls} value={db.farm.name} onChange={(e) => setFarm({ name: e.target.value })} /></Field>
          <Field label="County">
            <select className={inputCls} value={db.farm.county} onChange={(e) => { const c = findCounty(e.target.value); setFarm({ county: e.target.value, ...(c ? { lat: c.lat, lng: c.lng, gps: false } : {}) }) }}>
              <option value="">Not set</option>
              {COUNTIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </Field>
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-semibold">Species you keep</legend>
            <div className="grid sm:grid-cols-3">{SPECIES.map((s) => <Check key={s.id} checked={db.prefs.species.includes(s.id)} onChange={(v) => toggleSpecies(s.id, v)}>{s.name}</Check>)}</div>
          </fieldset>
          <Field label="Show reminders this far ahead">
            <select className={inputCls} value={db.prefs.reminderDays} onChange={(e) => setPrefs({ reminderDays: Number(e.target.value) })}>
              {[7, 14, 30].map((d) => <option key={d} value={d}>{d} days</option>)}
            </select>
          </Field>
          <Field label="Language" hint="Kiswahili is planned for a later version.">
            <select className={inputCls} disabled value="en"><option value="en">English</option><option value="sw">Kiswahili (planned)</option></select>
          </Field>
        </Card>
      </Section>

      <Section title="Your data">
        <Card className="space-y-4">
          <p>Your records are stored only in this browser. Back them up so a lost or reset phone does not lose your history.</p>
          <div className="flex flex-wrap gap-2.5">
            <Button icon="download" onClick={exportJson}>Download full backup</Button>
            <Button variant="secondary" icon="download" onClick={exportCsv}>Export CSV for spreadsheets</Button>
            <Button variant="secondary" icon="upload" onClick={() => fileRef.current?.click()}>Restore from backup</Button>
            <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-label="Choose backup file" onChange={(e) => { const f = e.target.files?.[0]; if (f) void importFile(f) }} />
          </div>
        </Card>
      </Section>

      <Section title="Try or reset">
        <Card className="space-y-3">
          <div className="flex flex-wrap gap-2.5">
            <Button variant="secondary" onClick={() => { if (!db.animals.length || window.confirm('Replace your current records with the sample farm?')) { replaceDb(sampleDb(todayISO())); setMsg({ tone: 'ok', text: 'Sample farm loaded.' }) } }}>Load sample farm</Button>
            <Button variant="danger" icon="trash" onClick={() => { if (window.confirm('Delete ALL records, saved guides and settings from this device? This cannot be undone.')) { resetDb(); setMsg({ tone: 'ok', text: 'Everything was deleted from this device.' }) } }}>Delete all my data</Button>
          </div>
          <p className="text-sm text-muted">Deleting removes data from this device only. Backups you downloaded are not affected.</p>
        </Card>
      </Section>

      <p className="mt-8 text-sm"><Link to="/sources" className="font-semibold text-napier-dark underline">Sources, content review and privacy</Link></p>
    </div>
  )
}
