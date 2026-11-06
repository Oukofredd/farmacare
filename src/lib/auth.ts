import { useSyncExternalStore } from 'react'

/** Version recorded with each local account's terms acceptance. */
export const TERMS_VERSION = '2026-11-05-draft'

const ACCOUNT_KEY = 'farmacare:local-account:v1'
const SESSION_KEY = 'farmacare:local-session:v1'
const HASH_ITERATIONS = 210_000

export interface Member {
  name: string
  email: string
  ageConfirmedAt: string
  termsAcceptedAt: string
  termsVersion: string
}

interface StoredAccount extends Member {
  salt: string
  passwordHash: string
}

let member = loadSession()
const listeners = new Set<() => void>()

function readAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    // Read the original one-account format so existing demo accounts still work.
    if (Array.isArray(parsed)) return parsed as StoredAccount[]
    return parsed && typeof parsed === 'object' && 'email' in parsed ? [parsed as StoredAccount] : []
  } catch {
    return []
  }
}

function publicMember(account: StoredAccount): Member {
  const { name, email, ageConfirmedAt, termsAcceptedAt, termsVersion } = account
  return { name, email, ageConfirmedAt, termsAcceptedAt, termsVersion }
}

function loadSession(): Member | null {
  try {
    const email = localStorage.getItem(SESSION_KEY)
    const account = readAccounts().find((item) => item.email === email)
    return email && account ? publicMember(account) : null
  } catch {
    return null
  }
}

/** Notifies React subscribers after the local sign-in state changes. */
function notify() {
  listeners.forEach((listener) => listener())
}

/** Hashes a password with a per-account salt for this device-local prototype. */
async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
  if (!crypto.subtle) throw new Error('Secure password hashing is unavailable in this browser.')
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const saltBuffer = new ArrayBuffer(salt.byteLength)
  new Uint8Array(saltBuffer).set(salt)
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBuffer, iterations: HASH_ITERATIONS, hash: 'SHA-256' },
    key,
    256,
  )
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function encodeSalt(salt: Uint8Array): string {
  return btoa(String.fromCharCode(...salt))
}

function decodeSalt(salt: string): Uint8Array {
  return Uint8Array.from(atob(salt), (char) => char.charCodeAt(0))
}

function commitMember(next: Member | null) {
  member = next
  try {
    if (next) localStorage.setItem(SESSION_KEY, next.email)
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    // Keep this tab usable even if browser storage is unavailable.
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('farmacare:account-change'))
  notify()
}

/** Registers a local prototype account after both required confirmations. */
export async function signUp(input: {
  name: string
  email: string
  password: string
  confirmsAdult: boolean
  acceptsTerms: boolean
}): Promise<Member> {
  if (!input.confirmsAdult) throw new Error('Confirm that you are at least 18 years old to continue.')
  if (!input.acceptsTerms) throw new Error('Accept the Terms and Conditions to create an account.')
  const accounts = readAccounts()
  const email = input.email.trim().toLowerCase()
  if (accounts.some((account) => account.email === email))
    throw new Error('An account with that email already exists on this device. Sign in instead.')

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const now = new Date().toISOString()
  const account: StoredAccount = {
    name: input.name.trim(),
    email,
    ageConfirmedAt: now,
    termsAcceptedAt: now,
    termsVersion: TERMS_VERSION,
    salt: encodeSalt(salt),
    passwordHash: await hashPassword(input.password, salt),
  }
  try {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify([...accounts, account]))
  } catch {
    throw new Error('Could not save the local account in this browser.')
  }
  const next = publicMember(account)
  commitMember(next)
  return next
}

/** Signs in to the local account stored in this browser. */
export async function signIn(email: string, password: string): Promise<Member> {
  const account = readAccounts().find((item) => item.email === email.trim().toLowerCase())
  if (!account)
    throw new Error('No matching local account was found. Check the email or sign up on this device.')
  const attemptedHash = await hashPassword(password, decodeSalt(account.salt))
  if (attemptedHash !== account.passwordHash) throw new Error('The password is incorrect.')
  const next = publicMember(account)
  commitMember(next)
  return next
}

/** Signs out of the current device-local account. */
export function signOut() {
  commitMember(null)
}

/** Subscribes a component to local sign-in changes and returns the current member. */
export function useAuth(): { member: Member | null } {
  return {
    member: useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    () => member,
    () => null,
    ),
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === SESSION_KEY || event.key === ACCOUNT_KEY) {
      member = loadSession()
      notify()
    }
  })
}
