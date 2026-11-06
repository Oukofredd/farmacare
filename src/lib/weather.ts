export interface ForecastDay {
  date: string
  max: number
  min: number
  rain: number
}

export interface Forecast {
  fetchedAt: string
  place: string
  lat: number
  lng: number
  current: { temp: number; humidity: number; rain: number }
  days: ForecastDay[]
}

/** Builds a per-location key for the browser's cached forecast. */
const cacheKey = (lat: number, lng: number) => `farmacare:weather:${lat.toFixed(2)},${lng.toFixed(2)}`

/** Reads a saved forecast for a location, or returns null if none can be used. */
export function cachedForecast(lat?: number, lng?: number): Forecast | null {
  if (lat === undefined || lng === undefined) return null
  try {
    const raw = localStorage.getItem(cacheKey(lat, lng))
    return raw ? (JSON.parse(raw) as Forecast) : null
  } catch {
    return null
  }
}

/** Free, keyless model forecast from Open-Meteo. Not an official KMD product. */
export async function fetchForecast(lat: number, lng: number, place: string): Promise<Forecast> {
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${lat}&longitude=${lng}` +
    '&current=temperature_2m,relative_humidity_2m,precipitation' +
    '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum' +
    '&timezone=Africa%2FNairobi&forecast_days=5'
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 9000)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) throw new Error(`Weather service replied ${res.status}`)
    const j = await res.json()
    const f: Forecast = {
      fetchedAt: new Date().toISOString(),
      place,
      lat,
      lng,
      current: {
        temp: j.current.temperature_2m,
        humidity: j.current.relative_humidity_2m,
        rain: j.current.precipitation,
      },
      days: (j.daily.time as string[]).map((d, i) => ({
        date: d,
        max: j.daily.temperature_2m_max[i],
        min: j.daily.temperature_2m_min[i],
        rain: j.daily.precipitation_sum[i],
      })),
    }
    try {
      localStorage.setItem(cacheKey(lat, lng), JSON.stringify(f))
    } catch {
      /* storage full: forecast still shown this session */
    }
    return f
  } finally {
    clearTimeout(timer)
  }
}
