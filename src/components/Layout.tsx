import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { Icon } from './ui'
import { useOnline } from '../lib/hooks'
import { signOut, useAuth } from '../lib/auth'

const MAIN = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/animals', label: 'Animals', icon: 'tag' },
  { to: '/calculator', label: 'Calculator', icon: 'calendar' },
  { to: '/breeds', label: 'Breeds', icon: 'book' },
  { to: '/genetics', label: 'Genetics', icon: 'tree' },
  { to: '/feeding', label: 'Feeding', icon: 'leaf' },
  { to: '/health', label: 'Health and care', icon: 'heart' },
  { to: '/myths', label: 'Myths and facts', icon: 'help' },
  { to: '/weather', label: 'Weather', icon: 'sun' },
  { to: '/saved', label: 'Saved guides', icon: 'bookmark' },
  { to: '/settings', label: 'Settings', icon: 'sliders' },
  { to: '/sources', label: 'Sources and privacy', icon: 'shield' },
]

const LEARN = ['/learn', '/breeds', '/genetics', '/feeding', '/health', '/myths', '/glossary']
const MORE = ['/more', '/weather', '/saved', '/settings', '/sources']

const BOTTOM = [
  { to: '/', label: 'Home', icon: 'home', match: (p: string) => p === '/' },
  { to: '/animals', label: 'Animals', icon: 'tag', match: (p: string) => p.startsWith('/animals') },
  { to: '/calculator', label: 'Calculator', icon: 'calendar', match: (p: string) => p.startsWith('/calculator') },
  { to: '/learn', label: 'Learn', icon: 'book', match: (p: string) => LEARN.some((x) => p.startsWith(x)) },
  { to: '/more', label: 'More', icon: 'more', match: (p: string) => MORE.some((x) => p.startsWith(x)) },
]

/** Renders the Farmacare wordmark for the mobile header or desktop sidebar. */
function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-lg bg-tag text-humus">
        <Icon name="tag" className="size-5" />
      </span>
      <span className={`font-display text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-humus'}`}>Farmacare</span>
    </Link>
  )
}

/** Resets scroll on route changes and scrolls directly to URL hash targets. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

/** Provides the shared navigation, connectivity status, and nested page outlet. */
export default function Layout() {
  const online = useOnline()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { member } = useAuth()

  /** Ends the local session and returns to the public home screen. */
  function handleSignOut() {
    signOut()
    navigate('/')
  }

  return (
    <div className="min-h-dvh md:flex">
      <ScrollManager />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>

      <aside className="app-print-hidden sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-1 overflow-y-auto border-r border-line bg-white p-4 md:flex">
        <div className="mb-4 px-2"><Brand /></div>
        {MAIN.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 rounded-xl px-3 font-semibold ${isActive ? 'bg-napier text-white' : 'text-humus hover:bg-napier-tint'}`
            }
          >
            <Icon name={n.icon} className="size-5" />
            {n.label}
          </NavLink>
        ))}
        <div className="mt-auto mb-2 rounded-xl bg-chalk p-3 text-sm">
          {member ? (
            <div className="flex items-center justify-between gap-2">
              <span className="min-w-0 truncate font-semibold">{member.name}</span>
              <button type="button" className="min-h-9 shrink-0 font-semibold text-napier-dark underline" onClick={handleSignOut}>Sign out</button>
            </div>
          ) : (
            <div className="flex gap-3 font-semibold text-napier-dark">
              <Link to="/login" className="inline-flex items-center gap-1 underline"><Icon name="user" className="size-4" />Log in</Link>
              <Link to="/register" className="inline-flex items-center gap-1 underline"><Icon name="plus" className="size-4" />Register</Link>
            </div>
          )}
        </div>
        <div className={`rounded-xl px-3 py-2 text-sm font-semibold ${online ? 'bg-napier-tint text-napier-dark' : 'bg-sun-tint text-sun-ink'}`}>
          {online ? 'Online' : 'Offline: using saved data'}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="app-print-hidden sticky top-0 z-20 flex items-center justify-between bg-napier px-4 pb-2.5 pt-[calc(0.625rem+env(safe-area-inset-top))] md:hidden">
          <Brand light />
          <div className="flex items-center gap-2">
            {member ? (
              <button type="button" className="min-h-9 rounded-lg px-2 text-sm font-semibold text-white underline" onClick={handleSignOut}>Sign out</button>
            ) : (
              <>
                <Link to="/login" className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-white underline"><Icon name="user" className="size-4" />Log in</Link>
                <Link to="/register" className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-white underline"><Icon name="plus" className="size-4" />Register</Link>
              </>
            )}
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${online ? 'bg-white/20 text-white' : 'bg-tag text-humus'}`}>
              {online ? 'Online' : 'Offline'}
            </span>
          </div>
        </header>

        {!online && (
          <div className="app-print-hidden bg-sun-tint px-4 py-2 text-center text-sm font-semibold text-sun-ink md:hidden" role="status">
            You are offline. Your records and saved guides still work.
          </div>
        )}

        <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-4 pb-32 pt-5 md:px-8 md:pb-12 md:pt-8">
          <Outlet />
        </main>

        <nav aria-label="Main" className="app-print-hidden fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
          <ul className="grid grid-cols-5">
            {BOTTOM.map((n) => {
              const active = n.match(pathname)
              return (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-semibold ${active ? 'text-napier-dark' : 'text-muted'}`}
                  >
                    <span className={`grid h-7 w-12 place-items-center rounded-full ${active ? 'bg-tag text-humus' : ''}`}>
                      <Icon name={n.icon} className="size-5" />
                    </span>
                    {n.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}
