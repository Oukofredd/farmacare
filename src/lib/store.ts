import { useSyncExternalStore } from 'react'
import type { Animal, AnimalEvent, Db, Farm, Prefs } from '../types'
import { uid } from './id'

const KEY = 'farmacare:v1'
const SESSION_KEY = 'farmacare:local-session:v1'
const GUEST_KEY = `${KEY}:guest`

/** Uses a separate local database for each signed-in demo account. */
function storageKey(): string {
  try {
    const email = localStorage.getItem(SESSION_KEY)
    return email ? `${KEY}:${encodeURIComponent(email)}` : GUEST_KEY
  } catch {
    return GUEST_KEY
  }
}

/** Keeps pre-account farm data with the existing signed-in user, or as guest data. */
function migrateLegacyData() {
  try {
    const legacy = localStorage.getItem(KEY)
    if (!legacy) return
    const target = storageKey()
    if (!localStorage.getItem(target)) localStorage.setItem(target, legacy)
    localStorage.removeItem(KEY)
  } catch {
    // If browser storage is blocked, the current in-memory database still works.
  }
}

/** Returns a fresh database with no animals, events, or bookmarks. */
export function emptyDb(): Db {
  return {
    version: 1,
    animals: [],
    events: [],
    farm: { name: '', county: '' },
    prefs: { species: [], reminderDays: 14 },
    bookmarks: [],
  }
}

/** Repairs malformed or partial saved data by filling missing database fields. */
function sanitize(raw: unknown): Db {
  const base = emptyDb()
  if (!raw || typeof raw !== 'object') return base
  const r = raw as Partial<Db>
  return {
    version: 1,
    animals: Array.isArray(r.animals) ? r.animals : [],
    events: Array.isArray(r.events) ? r.events : [],
    farm: { ...base.farm, ...(r.farm ?? {}) },
    prefs: { ...base.prefs, ...(r.prefs ?? {}) },
    bookmarks: Array.isArray(r.bookmarks) ? r.bookmarks : [],
  }
}

/** Loads and validates the saved database, falling back to an empty one on error. */
function load(): Db {
  try {
    const raw = localStorage.getItem(storageKey())
    return raw ? sanitize(JSON.parse(raw)) : emptyDb()
  } catch {
    return emptyDb()
  }
}

migrateLegacyData()
let state: Db = load()
let saveFailed = false
const listeners = new Set<() => void>()

/** Saves a new database snapshot and notifies every subscribed screen. */
function commit(next: Db) {
  state = next
  try {
    localStorage.setItem(storageKey(), JSON.stringify(next))
    saveFailed = false
  } catch {
    saveFailed = true
  }
  listeners.forEach((l) => l())
}

/** Registers a listener that should rerender when the database changes. */
function subscribe(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('storage', (e) => {
    if (e.key === SESSION_KEY || e.key === KEY || e.key === GUEST_KEY || e.key?.startsWith(`${KEY}:`)) {
      state = load()
      listeners.forEach((l) => l())
    }
  })
  window.addEventListener('farmacare:account-change', () => {
    state = load()
    listeners.forEach((l) => l())
  })
}

/** Returns the current in-memory database snapshot. */
export const getDb = () => state
/** Reports whether the most recent database save failed. */
export const didSaveFail = () => saveFailed
/** Subscribes a React component to the current saved database snapshot. */
export function useDb(): Db {
  return useSyncExternalStore(subscribe, getDb, getDb)
}

/** Creates an ISO timestamp for newly created or updated records. */
const now = () => new Date().toISOString()

/** Creates an animal record, assigns its ID and timestamps, then saves it. */
export function addAnimal(input: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>): Animal {
  const a: Animal = { ...input, id: uid(), createdAt: now(), updatedAt: now() }
  commit({ ...state, animals: [...state.animals, a] })
  return a
}

/** Updates an animal while refreshing its last-updated timestamp. */
export function updateAnimal(id: string, patch: Partial<Animal>) {
  commit({
    ...state,
    animals: state.animals.map((a) => (a.id === id ? { ...a, ...patch, updatedAt: now() } : a)),
  })
}

/** Removes an animal and its event history from the database. */
export function deleteAnimal(id: string) {
  commit({
    ...state,
    animals: state.animals.filter((a) => a.id !== id),
    events: state.events.filter((e) => e.animalId !== id),
  })
}

/** Adds an event to an animal's history and returns the saved event. */
export function addEvent(input: Omit<AnimalEvent, 'id' | 'createdAt'>): AnimalEvent {
  const e: AnimalEvent = { ...input, id: uid(), createdAt: now() }
  commit({ ...state, events: [...state.events, e] })
  return e
}

/** Applies edits to an existing event. */
export function updateEvent(id: string, patch: Partial<AnimalEvent>) {
  commit({ ...state, events: state.events.map((e) => (e.id === id ? { ...e, ...patch } : e)) })
}

/** Removes one event from the database. */
export function deleteEvent(id: string) {
  commit({ ...state, events: state.events.filter((e) => e.id !== id) })
}

/** Updates the farm profile while preserving fields not included in the patch. */
export function setFarm(patch: Partial<Farm>) {
  commit({ ...state, farm: { ...state.farm, ...patch } })
}

/** Updates reminder and species preferences while preserving other settings. */
export function setPrefs(patch: Partial<Prefs>) {
  commit({ ...state, prefs: { ...state.prefs, ...patch } })
}

/** Adds a bookmark if it is absent, or removes it if it is already saved. */
export function toggleBookmark(id: string) {
  const has = state.bookmarks.includes(id)
  commit({ ...state, bookmarks: has ? state.bookmarks.filter((b) => b !== id) : [...state.bookmarks, id] })
}

/** Replaces the current database with sanitized imported data. */
export function replaceDb(next: unknown) {
  commit(sanitize(next))
}

/** Clears all saved farm records and restores the empty database. */
export function resetDb() {
  commit(emptyDb())
}

/** Parse a backup file. Throws a readable error when it is not a Farmacare backup. */
export function parseBackup(text: string): Db {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('That file is not valid JSON.')
  }
  const d = data as Partial<Db>
  if (!d || !Array.isArray(d.animals) || !Array.isArray(d.events))
    throw new Error('That file is not a Farmacare backup (animals or events are missing).')
  return sanitize(d)
}

/** Escapes one value according to CSV quoting rules. */
function csvCell(v: unknown): string {
  const s = v === undefined || v === null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Converts records into a CSV string with escaped cells. */
export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))))
  return [cols.join(','), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(','))].join('\n')
}

/** Starts a browser download for the supplied text and MIME type. */
export function download(filename: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
