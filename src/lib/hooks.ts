import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { cachedForecast, fetchForecast } from './weather'
import type { Forecast } from './weather'

/** Subscribes React to browser online/offline changes. */
function subscribeOnline(cb: () => void) {
  window.addEventListener('online', cb)
  window.addEventListener('offline', cb)
  return () => {
    window.removeEventListener('online', cb)
    window.removeEventListener('offline', cb)
  }
}

/** Exposes the browser's online status as a reactive hook value. */
export function useOnline(): boolean {
  return useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true)
}

interface InstallEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: InstallEvent | null = null
const installListeners = new Set<() => void>()
/** Notifies install-button subscribers when the browser install prompt changes. */
const notifyInstall = () => installListeners.forEach((l) => l())

if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred = e as InstallEvent
    notifyInstall()
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    notifyInstall()
  })
}

/** Exposes install-prompt availability and a handler for the browser prompt. */
export function useInstall() {
  const can = useSyncExternalStore(
    (cb) => {
      installListeners.add(cb)
      return () => {
        installListeners.delete(cb)
      }
    },
    () => deferred !== null,
    () => false,
  )
  /** Prompts the browser to install the app, if it offered an install event. */
  const install = useCallback(async () => {
    if (!deferred) return
    await deferred.prompt()
    deferred = null
    notifyInstall()
  }, [])
  return { can, install }
}

const STALE_MS = 3 * 3600 * 1000

/** Forecast for a point. Uses the saved copy offline and refreshes quietly when online. */
export function useForecast(lat?: number, lng?: number, place = '') {
  const online = useOnline()
  const [live, setLive] = useState<Forecast | null>(null)
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(false)

  const forecast = live && live.lat === lat && live.lng === lng ? live : cachedForecast(lat, lng)

  useEffect(() => {
    if (!online || lat === undefined || lng === undefined) return
    const c = cachedForecast(lat, lng)
    if (c && Date.now() - new Date(c.fetchedAt).getTime() < STALE_MS) return
    let cancelled = false
    fetchForecast(lat, lng, place)
      .then((f) => {
        if (!cancelled) {
          setLive(f)
          setFailed(false)
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [online, lat, lng, place])

  /** Forces a fresh forecast request for the currently selected location. */
  const refresh = useCallback(() => {
    if (lat === undefined || lng === undefined) return
    setLoading(true)
    fetchForecast(lat, lng, place)
      .then((f) => {
        setLive(f)
        setFailed(false)
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [lat, lng, place])

  return { forecast, failed, loading, refresh }
}
