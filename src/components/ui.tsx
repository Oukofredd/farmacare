import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'
import { toggleBookmark, useDb } from '../lib/store'
import { CONTENT_STATUS } from '../data/sources'

/* ---------- icons ---------- */
const PATHS: Record<string, string> = {
  user: 'M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
  home: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  tag: 'M7 3h10a2 2 0 0 1 2 2v9a7 7 0 0 1-14 0V5a2 2 0 0 1 2-2zM12 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
  calendar: 'M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 1 2-2h13',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  plus: 'M12 5v14M5 12h14',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  sun: 'M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  alert: 'M12 3l10 18H2zM12 10v4M12 17h.01',
  check: 'M5 12l5 5L20 7',
  right: 'M9 6l6 6-6 6',
  back: 'M15 6l-6 6 6 6',
  offline: 'M3 3l18 18M5 12a10 10 0 0 1 4-2.3M12 19h.01M8.5 15.5a5 5 0 0 1 3-1.4M16 11a10 10 0 0 1 3 1.5',
  sliders: 'M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M6 15v4',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  download: 'M12 4v12M7 11l5 5 5-5M5 20h14',
  edit: 'M4 20h4L19 9l-4-4L4 16z',
  heart: 'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z',
  tree: 'M12 3v6M12 9l-6 6v6M12 9l6 6v6',
  leaf: 'M5 19C5 9 10 4 20 4c0 10-5 15-15 15zM5 19l8-8',
  help: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v6M12 7.5h.01',
  pin: 'M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12zM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  upload: 'M12 20V8M7 13l5-5 5 5M5 4h14',
}

/** Draws a named icon from the shared inline SVG path collection. */
export function Icon({ name, className = 'size-5' }: { name: keyof typeof PATHS | string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={name === 'more' ? 3 : 1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name] ?? PATHS.info} />
    </svg>
  )
}

/* ---------- the signature: a livestock ear tag ---------- */
/** Shows an animal's identifier in the app's distinctive ear-tag style. */
export function EarTag({ tag, size = 'md', animate = false }: { tag: string; size?: 'sm' | 'md' | 'lg'; animate?: boolean }) {
  const sizes = {
    sm: { box: 'text-xs pl-5 pr-2 py-0.5', hole: 'left-1.5 size-1.5' },
    md: { box: 'text-sm pl-6 pr-2.5 py-1', hole: 'left-2 size-2' },
    lg: { box: 'text-3xl pl-11 pr-5 py-2.5', hole: 'left-4 size-3.5' },
  }[size]
  return (
    <span
      className={`relative inline-flex items-center rounded-lg bg-tag font-display font-extrabold tracking-tight text-humus shadow-[inset_0_0_0_1.5px_rgba(36,48,31,0.28)] ${sizes.box} ${animate ? 'tag-settle' : ''}`}
    >
      <span aria-hidden="true" className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-chalk shadow-[inset_0_0_0_1.5px_rgba(36,48,31,0.45)] ${sizes.hole}`} />
      <span className="sr-only">Tag </span>
      {tag}
    </span>
  )
}

/* ---------- buttons ---------- */
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'tag'
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-napier text-white hover:bg-napier-dark',
  secondary: 'bg-white text-humus border border-line hover:bg-napier-tint',
  danger: 'bg-murram text-white hover:bg-murram-dark',
  ghost: 'text-napier-dark hover:bg-napier-tint',
  tag: 'bg-tag text-humus hover:brightness-95',
}
/** Builds the shared Tailwind classes for a button variant and width. */
export const btnCls = (v: Variant = 'primary', block = false) =>
  `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-base font-semibold transition-colors disabled:opacity-50 ${VARIANTS[v]} ${block ? 'w-full' : ''}`

/** Renders a styled button with an optional leading icon. */
export function Button({
  variant = 'primary', block, icon, children, ...rest
}: { variant?: Variant; block?: boolean; icon?: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" {...rest} className={`${btnCls(variant, block)} ${rest.className ?? ''}`}>
      {icon && <Icon name={icon} className="size-4.5" />}
      {children}
    </button>
  )
}

/** Renders a router link with the same visual treatment as a button. */
export function LinkButton({
  to, variant = 'primary', block, icon, children,
}: { to: string; variant?: Variant; block?: boolean; icon?: string; children: ReactNode }) {
  return (
    <Link to={to} className={btnCls(variant, block)}>
      {icon && <Icon name={icon} className="size-4.5" />}
      {children}
    </Link>
  )
}

/* ---------- layout bits ---------- */
/** Renders a page title, optional subtitle, back link, and action. */
export function PageHeader({
  title, subtitle, back, action,
}: { title: ReactNode; subtitle?: ReactNode; back?: { to: string; label: string }; action?: ReactNode }) {
  return (
    <header className="mb-5">
      {back && (
        <Link to={back.to} className="mb-2 inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-napier-dark hover:underline">
          <Icon name="back" className="size-4" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-1 max-w-prose text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  )
}

/** Groups related page content under an optional heading and action. */
export function Section({ title, action, children, id }: { title?: ReactNode; action?: ReactNode; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="mt-8 scroll-mt-20 first:mt-0">
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

/** Wraps content in the standard bordered white card. */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white p-4 ${className}`}>{children}</div>
}

type Tone = 'neutral' | 'green' | 'yellow' | 'red' | 'blue'
const TONES: Record<Tone, string> = {
  neutral: 'bg-chalk text-muted border-line',
  green: 'bg-napier-tint text-napier-dark border-transparent',
  yellow: 'bg-sun-tint text-sun-ink border-transparent',
  red: 'bg-murram-tint text-murram-dark border-transparent',
  blue: 'bg-rift-tint text-rift border-transparent',
}
/** Shows a compact status label using one of the shared visual tones. */
export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]}`}>{children}</span>
}

/** Marks informational content as awaiting veterinary review. */
export function ReviewBadge() {
  return <Badge tone="yellow">{CONTENT_STATUS.short}</Badge>
}

/** Displays a highlighted message with a tone-specific icon and styling. */
export function Callout({ tone = 'info', title, children }: { tone?: 'info' | 'warn' | 'danger' | 'ok'; title?: string; children: ReactNode }) {
  const t = {
    info: 'border-rift/30 bg-rift-tint text-humus',
    warn: 'border-tag bg-sun-tint text-humus',
    danger: 'border-murram/40 bg-murram-tint text-humus',
    ok: 'border-napier/30 bg-napier-tint text-humus',
  }[tone]
  const icon = { info: 'info', warn: 'alert', danger: 'alert', ok: 'check' }[tone]
  return (
    <div className={`flex gap-3 rounded-xl border-l-4 p-3.5 ${t}`} role={tone === 'danger' ? 'alert' : undefined}>
      <Icon name={icon} className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0 text-[0.95rem]">
        {title && <p className="font-bold">{title}</p>}
        <div className={title ? 'mt-0.5' : ''}>{children}</div>
      </div>
    </div>
  )
}

/** Shows the standard reminder that app guidance does not replace veterinary care. */
export function VetNote() {
  return (
    <Callout tone="info" title="Guidance, not diagnosis">
      Farmacare gives general education. It cannot examine your animal. For illness, medicines, precise rations or anything urgent, contact a veterinarian or animal health worker.
    </Callout>
  )
}

/** Explains an empty list and optionally provides the next useful action. */
export function EmptyState({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white/60 p-6 text-center">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-muted">{body}</p>
      {children && <div className="mt-4 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  )
}

/** Renders accessible tabs and reports the selected tab to the parent. */
export function Tabs<T extends string>({
  tabs, value, onChange, label,
}: { tabs: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="-mx-4 mb-5 flex gap-1 overflow-x-auto border-b border-line px-4">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={`min-h-11 shrink-0 border-b-4 px-3.5 text-[0.95rem] font-semibold transition-colors ${
            value === t.id ? 'border-napier text-humus' : 'border-transparent text-muted hover:text-humus'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* ---------- forms ---------- */
export const inputCls =
  'mt-1 block min-h-11 w-full rounded-xl border border-line bg-white px-3 py-2 text-base text-humus placeholder:text-muted/70 focus:border-napier'

/** Associates a form label, input, hint, and validation message. */
export function Field({
  label, hint, error, children,
}: { label: string; hint?: ReactNode; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-sm text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-sm font-semibold text-murram-dark" role="alert">{error}</span>}
    </label>
  )
}

/** Renders a checkbox whose boolean value is controlled by its parent. */
export function Check({
  checked, onChange, children,
}: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex min-h-11 items-start gap-3 py-1.5">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 size-5 accent-napier" />
      <span className="text-[0.95rem]">{children}</span>
    </label>
  )
}

/* ---------- saved guides ---------- */
/** Toggles a content bookmark and reflects whether it is currently saved. */
export function BookmarkButton({ id }: { id: string }) {
  const db = useDb()
  const saved = db.bookmarks.includes(id)
  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={() => toggleBookmark(id)}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition-colors ${
        saved ? 'border-transparent bg-tag text-humus' : 'border-line bg-white text-humus hover:bg-napier-tint'
      }`}
    >
      <Icon name="bookmark" className="size-4" />
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}

/** Draws a progress bar with an accessible percentage label. */
export function Meter({ percent }: { percent: number }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-napier-tint" role="img" aria-label={`${percent} percent complete`}>
      <div className="h-full rounded-full bg-napier" style={{ width: `${percent}%` }} />
    </div>
  )
}
