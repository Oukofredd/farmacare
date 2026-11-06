// Run with: npm run test:logic
import assert from 'node:assert/strict'

const mem = new Map<string, string>()
;(globalThis as any).localStorage = {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => void mem.set(k, v),
  removeItem: (k: string) => void mem.delete(k),
}

const dates = await import('../src/lib/dates')
const { buildPlan } = await import('../src/lib/lifecycle')
const rel = await import('../src/lib/relations')
const { recordQuality } = await import('../src/lib/quality')
const { buildSchedule, openBreedings } = await import('../src/lib/schedule')
const { buildAdvisories, weatherAdvisories } = await import('../src/lib/advisories')
const { sampleDb } = await import('../src/data/sample')
const store = await import('../src/lib/store')
const { matchBreeds, BREEDS } = await import('../src/data/breeds')
const { suggestFeeding } = await import('../src/data/feeding')
const { checkGeneticStatus } = await import('../src/data/genetics')
const { COUNTIES } = await import('../src/data/counties')
const { resolveBookmark } = await import('../src/data')

let n = 0
/** Runs one logic-check group and prints its name when it succeeds. */
const t = (name: string, fn: () => void) => { fn(); n++; console.log('ok -', name) }

t('addDays handles month/year/leap boundaries', () => {
  assert.equal(dates.addDays('2026-10-26', 283), '2027-08-05')
  assert.equal(dates.addDays('2027-12-30', 3), '2028-01-02')
  assert.equal(dates.addDays('2028-02-28', 1), '2028-02-29')
  assert.equal(dates.diffDays('2026-10-26', '2026-11-26'), 31)
})

t('cattle gestation: 283 days; range 279-290', () => {
  const p = buildPlan('cattle', '2026-01-01')
  assert.equal(p.due, '2026-10-11')
  assert.equal(p.earliest, '2026-10-07')
  assert.equal(p.latest, '2026-10-18')
})

t('known reference cases for other species', () => {
  assert.equal(buildPlan('chicken', '2026-03-01').due, '2026-03-22')
  assert.equal(buildPlan('pig', '2026-01-01').due, '2026-04-25') // 114 days
  assert.equal(buildPlan('goat', '2026-01-01').due, '2026-05-31') // 150 days
  assert.equal(buildPlan('sheep', '2026-01-01').due, '2026-05-28') // 147 days
})

t('age text', () => {
  assert.equal(dates.ageText('2026-10-20', '2026-10-26'), '6 days old')
  assert.equal(dates.ageText('2026-08-01', '2026-10-26'), '2 months old')
  assert.equal(dates.ageText('2022-04-10', '2026-10-26'), '4 yr 6 mo old')
  assert.equal(dates.ageText(undefined), 'Age unknown')
})

t('seasons', () => {
  assert.equal(dates.seasonFor('2026-10-26').id, 'short-rains')
  assert.equal(dates.seasonFor('2026-04-10').id, 'long-rains')
})

const today = '2026-10-26'
const db = sampleDb(today)

t('pedigree: parent-offspring and sibling detection', () => {
  /** Finds a demo animal by tag for the pedigree assertions. */
  const by = (tag: string) => db.animals.find((a) => a.tag === tag)!
  assert.equal(rel.relationBetween(by('KB-001'), by('KB-103'))?.kind, 'parent-offspring')
  assert.equal(rel.relationBetween(by('KB-102'), by('KB-103'))?.kind, 'half-siblings') // share sire KB-001
  assert.equal(rel.relationBetween(by('KB-101'), by('KB-102')), null)
  const w = rel.checkPairing(by('KB-103'), 'KB-001', db.animals)
  assert.equal(w[0].level, 'high')
  assert.equal(rel.checkPairing(by('KB-101'), 'Unknown bull', db.animals)[0].level, 'info')
  assert.equal(rel.checkParentage('X1', 'X1', 'cattle', db.animals)[0].level, 'high')
})

t('record quality never counts unknowns as facts', () => {
  const pig = db.animals.find((a) => a.tag === 'P-07')!
  const q = recordQuality(pig, db.events)
  assert.ok(q.percent < 40, `pig percent ${q.percent}`)
  assert.ok(q.missing.some((m) => m.key === 'source'))
})

t('schedule: due, milestone, recheck, withdrawal', () => {
  const s = buildSchedule(db, today)
  assert.ok(s.some((i) => i.kind === 'due' && i.tag === 'KB-101'))
  assert.ok(s.some((i) => i.kind === 'withdrawal' && i.tag === 'KB-102'))
  assert.ok(s.some((i) => i.kind === 'recheck' && i.tag === 'FLK-A' && i.overdue))
  assert.ok(s.some((i) => i.kind === 'recheck' && i.tag === 'KB-101' && !i.overdue))
  // pregnancy confirmed -> no "return to heat" reminder
  assert.ok(!s.some((i) => i.tag === 'KB-101' && /return to heat/i.test(i.title)))
})

t('birth closes a breeding record', () => {
  const ev = db.events.find((e) => e.id === 'ev1')!
  assert.equal(openBreedings(db.events).some((e) => e.id === 'ev1'), true)
  const closed = [...db.events, { ...ev, id: 'b', type: 'birth' as const, linkedId: 'ev1' }]
  assert.equal(openBreedings(closed).some((e) => e.id === 'ev1'), false)
})

t('advisories sorted urgent first and include withdrawal', () => {
  const adv = buildAdvisories(db, today)
  assert.equal(adv[0].level, 'urgent')
  assert.ok(adv.some((a) => /do not sell milk/i.test(a.title)))
  assert.ok(adv.some((a) => a.id === 'verify'))
})

t('weather advisories', () => {
  const hot = { fetchedAt: '', place: 'x', lat: 0, lng: 0, current: { temp: 30, humidity: 50, rain: 0 }, days: [
    { date: today, max: 36, min: 20, rain: 0 }, { date: '2026-10-27', max: 33, min: 19, rain: 25 }] }
  const a = weatherAdvisories(db, hot)
  assert.ok(a.some((x) => x.id === 'wx-heat' && x.level === 'urgent'))
  assert.ok(a.some((x) => x.id === 'wx-rain'))
  assert.deepEqual(weatherAdvisories(db, null), [])
})

t('breed matcher: hot dry + low input meat -> local breeds beat Boer? at least ordering sane', () => {
  const r = matchBreeds({ species: 'cattle', goal: 'milk', climate: 'hot', management: 1, feed: 1 })
  const fr = r.find((x) => x.breed.id === 'friesian')!
  const sah = r.find((x) => x.breed.id === 'sahiwal')!
  assert.ok(sah.score > fr.score)
  assert.equal(fr.label, 'Needs care')
  const hi = matchBreeds({ species: 'cattle', goal: 'milk', climate: 'cool', management: 3, feed: 3 })
  assert.equal(hi.find((x) => x.breed.id === 'friesian')!.label, 'Good fit')
  assert.ok(BREEDS.length >= 20)
})

t('feeding suggestions follow age + state', () => {
  const calf = suggestFeeding('cattle', 3, 'female', false, false).map((s) => s.guide.id)
  assert.deepEqual(calf, ['cattle-calf'])
  const dry = suggestFeeding('cattle', 48, 'female', true, false).map((s) => s.guide.id)
  assert.ok(dry.includes('cattle-dry') && !dry.includes('cattle-lactating'))
  const layer = suggestFeeding('chicken', 8, 'female', false, false).map((s) => s.guide.id)
  assert.ok(layer.includes('chicken-layer'))
  assert.deepEqual(suggestFeeding('cattle', undefined, 'female', false, false), [])
})

t('genetic status checker never infers from looks', () => {
  assert.equal(checkGeneticStatus({ hatchery: 'no', certificate: 'yes', knownParents: 'yes' }).status, 'purebred_documented')
  assert.equal(checkGeneticStatus({ hatchery: 'yes', certificate: 'no', knownParents: 'no' }).status, 'commercial_hybrid')
  assert.equal(checkGeneticStatus({ hatchery: 'no', certificate: 'unsure', knownParents: 'unsure' }).status, 'unknown')
})

t('store: add/update/delete/cascade + backup round-trip + csv', () => {
  store.resetDb()
  const a = store.addAnimal({ tag: 'T1', species: 'goat', breedId: 'boer', sex: 'male', count: 1, dobEstimated: false, source: 'unknown', pedigreeVerified: false, geneticStatus: 'unknown', status: 'active' })
  store.addEvent({ animalId: a.id, type: 'note', date: today, title: 'hello, "world"' })
  assert.equal(store.getDb().events.length, 1)
  const backup = JSON.stringify(store.getDb())
  store.updateAnimal(a.id, { name: 'Billy' })
  assert.equal(store.getDb().animals[0].name, 'Billy')
  store.deleteAnimal(a.id)
  assert.equal(store.getDb().events.length, 0)
  store.replaceDb(store.parseBackup(backup))
  assert.equal(store.getDb().animals.length, 1)
  assert.throws(() => store.parseBackup('{"x":1}'))
  assert.throws(() => store.parseBackup('nope'))
  assert.match(store.toCsv([{ a: 'x,y', b: 'q"r' }]), /"x,y","q""r"/)
  assert.ok(mem.get('farmacare:v1'))
  store.toggleBookmark('breed:boer')
  assert.deepEqual(store.getDb().bookmarks, ['breed:boer'])
})

t('data integrity: 47 counties, bookmark resolution, unique ids', () => {
  assert.equal(COUNTIES.length, 47)
  assert.equal(new Set(BREEDS.map((b) => b.id)).size, BREEDS.length)
  assert.equal(resolveBookmark('breed:friesian')?.href, '/breeds/friesian')
  assert.equal(resolveBookmark('myth:nope'), null)
})

console.log(`\n${n} test groups passed`)
