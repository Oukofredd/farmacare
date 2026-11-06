import { useState } from 'react'
import { BookmarkButton, Callout, Card, Field, PageHeader, Section, inputCls } from '../components/ui'
import { GENETIC_TERMS, INBREEDING, WHAT_APPEARANCE_CANNOT_TELL, checkGeneticStatus } from '../data/genetics'
import type { CheckerAnswer } from '../data/genetics'

const YNU = [['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']] as const

/** Explains genetic-status terms and provides a documentation-based checker. */
export default function Genetics() {
  const [a, setA] = useState<{ hatchery: CheckerAnswer; certificate: CheckerAnswer; knownParents: CheckerAnswer }>({ hatchery: 'unsure', certificate: 'unsure', knownParents: 'unsure' })
  const result = checkGeneticStatus(a)
  /** Renders one answer selector for the genetic-status checker. */
  const q = (key: keyof typeof a, label: string) => (
    <Field label={label}>
      <select className={inputCls} value={a[key]} onChange={(e) => setA({ ...a, [key]: e.target.value as CheckerAnswer })}>
        {YNU.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </Field>
  )
  return (
    <div>
      <PageHeader title="Genetics and breeding" subtitle="What purebred, crossbred, hybrid and GMO really mean, and how to record what you know honestly." />

      <div className="space-y-4">
        {GENETIC_TERMS.map((t) => (
          <article key={t.id} id={t.id} className="scroll-mt-20 rounded-2xl border border-line bg-white p-4 md:p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl font-extrabold">{t.term}</h2>
              <BookmarkButton id={`term:${t.id}`} />
            </div>
            <p className="mt-1 text-lg font-semibold">{t.short}</p>
            <p className="mt-2 max-w-prose">{t.detail}</p>
            <dl className="mt-3 grid gap-3 text-[0.95rem] sm:grid-cols-2">
              <div><dt className="font-bold">Example</dt><dd className="text-muted">{t.example}</dd></div>
              <div><dt className="font-bold">How to check</dt><dd className="text-muted">{t.howToCheck}</dd></div>
            </dl>
          </article>
        ))}
      </div>

      <Section title="What looks cannot tell you">
        <Callout tone="warn" title="Do not guess from appearance">
          <ul className="mt-1 list-disc space-y-1 pl-5">{WHAT_APPEARANCE_CANNOT_TELL.map((x) => <li key={x}>{x}</li>)}</ul>
          <p className="mt-2">Farmacare therefore records unknown status as unknown.</p>
        </Callout>
      </Section>

      <Section title="Genetic status checker" id="checker">
        <Card>
          <p className="mb-3 text-muted">Three questions suggest how to record an animal. It never judges by looks.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {q('certificate', 'Do you have a registry certificate or pedigree?')}
            {q('hatchery', 'Did it come from a hatchery or breeding company line?')}
            {q('knownParents', 'Do you know both parents and their breeds?')}
          </div>
          <div className="mt-4 rounded-xl bg-napier-tint p-4" aria-live="polite">
            <p className="text-sm text-muted">Suggested record</p>
            <p className="font-display text-2xl font-extrabold">{result.title}</p>
            <p className="mt-1">{result.advice}</p>
          </div>
        </Card>
      </Section>

      <Section title={INBREEDING.title}>
        <p className="max-w-prose">{INBREEDING.body}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">{INBREEDING.tips.map((x) => <li key={x}>{x}</li>)}</ul>
      </Section>
    </div>
  )
}
