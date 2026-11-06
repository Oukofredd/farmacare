import { getBreed } from './breeds'
import { FEED_GUIDES } from './feeding'
import { GENETIC_TERMS } from './genetics'
import { MYTHS } from './myths'

export interface Bookmarked {
  id: string
  kind: string
  title: string
  href: string
}

/** Saved guides are stored as "kind:id". This turns them back into links. */
/** Resolves a saved content key to the page that displays that item. */
export function resolveBookmark(key: string): Bookmarked | null {
  const [kind, id] = key.split(':')
  if (kind === 'breed') {
    const b = getBreed(id)
    return b ? { id: key, kind: 'Breed', title: b.name, href: `/breeds/${b.id}` } : null
  }
  if (kind === 'myth') {
    const m = MYTHS.find((x) => x.id === id)
    return m ? { id: key, kind: 'Myth or fact', title: m.claim, href: `/myths/${m.id}` } : null
  }
  if (kind === 'feed') {
    const g = FEED_GUIDES.find((x) => x.id === id)
    return g ? { id: key, kind: 'Feeding guide', title: g.title, href: `/feeding#${g.id}` } : null
  }
  if (kind === 'term') {
    const t = GENETIC_TERMS.find((x) => x.id === id)
    return t ? { id: key, kind: 'Genetics', title: t.term, href: `/genetics#${t.id}` } : null
  }
  return null
}
