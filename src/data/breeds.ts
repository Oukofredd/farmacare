import type { SpeciesId } from '../types'

export type Purpose = 'milk' | 'meat' | 'eggs' | 'dual'
export type BreedType = 'indigenous' | 'exotic' | 'composite' | 'hybrid'

export interface Breed {
  id: string
  species: SpeciesId
  name: string
  origin: string
  type: BreedType
  purposes: Purpose[]
  summary: string
  size: string
  production: string
  /** 1 = struggles in heat, 3 = tolerates heat well */
  heat: 1 | 2 | 3
  /** 1 = copes on modest feed, 3 = needs high-quality feed */
  feedDemand: 1 | 2 | 3
  /** 1 = low-input systems, 3 = needs intensive management and vet access */
  management: 1 | 2 | 3
  strengths: string[]
  limits: string[]
  evidenceNote: string
}

const GENERAL =
  'General description from common breed knowledge. Figures are indicative and vary widely with feeding and management. Pending review against KALRO and breed society sources.'

export const BREEDS: Breed[] = [
  // Cattle
  {
    id: 'friesian', species: 'cattle', name: 'Friesian (Holstein-Friesian)', origin: 'Netherlands and northern Germany', type: 'exotic', purposes: ['milk'],
    summary: 'The highest-volume dairy breed in common use in Kenya, best suited to cool highlands and well-managed farms.',
    size: 'Large. Mature cows commonly 550 to 650 kg.', production: 'Highest milk volume of the common dairy breeds. Real yields depend heavily on feed, water and health care.',
    heat: 1, feedDemand: 3, management: 3,
    strengths: ['Very high milk volume when well fed', 'Semen and AI services widely available'],
    limits: ['Sensitive to heat stress', 'Needs high-quality feed and a lot of clean water', 'Needs strict tick and mastitis control', 'Does poorly under low-input management'],
    evidenceNote: GENERAL,
  },
  {
    id: 'ayrshire', species: 'cattle', name: 'Ayrshire', origin: 'Ayrshire, Scotland', type: 'exotic', purposes: ['milk'],
    summary: 'A medium-sized dairy breed with good udders and a reputation for grazing well in cooler highland areas.',
    size: 'Medium to large. Mature cows commonly 450 to 550 kg.', production: 'Moderate to high milk volume with good milk quality.',
    heat: 1, feedDemand: 2, management: 3,
    strengths: ['Good grazer and generally robust for a European dairy breed', 'Does well in highland farms'],
    limits: ['Heat stress in hot lowlands', 'Still needs good feed, water and tick control'],
    evidenceNote: GENERAL,
  },
  {
    id: 'jersey', species: 'cattle', name: 'Jersey', origin: 'Jersey, Channel Islands', type: 'exotic', purposes: ['milk'],
    summary: 'A small dairy breed that gives rich milk and eats less than a Friesian, which suits smaller farms.',
    size: 'Small to medium. Mature cows commonly 350 to 450 kg.', production: 'Lower volume than Friesian but very high butterfat, so milk is rich.',
    heat: 2, feedDemand: 2, management: 3,
    strengths: ['Efficient for its body size', 'Rich milk', 'Handles warmth somewhat better than larger dairy breeds'],
    limits: ['Lower total milk volume', 'Still a European dairy breed that needs good feed, shade and tick control'],
    evidenceNote: GENERAL,
  },
  {
    id: 'boran', species: 'cattle', name: 'Boran', origin: 'Southern Ethiopia and northern Kenya', type: 'indigenous', purposes: ['meat'],
    summary: 'A hardy, well-muscled zebu beef breed developed for dry rangelands and widely used across Kenya.',
    size: 'Medium to large. Mature cows commonly 400 to 450 kg, bulls heavier.', production: 'Good beef carcass for a zebu type. Low milk, enough to rear a calf.',
    heat: 3, feedDemand: 1, management: 1,
    strengths: ['Tolerates heat, drought and poor pasture', 'Good meat quality', 'Fertile and long-lived'],
    limits: ['Low milk yield', 'Slower growth than intensive exotic beef breeds'],
    evidenceNote: GENERAL,
  },
  {
    id: 'sahiwal', species: 'cattle', name: 'Sahiwal', origin: 'Punjab region, Pakistan and India', type: 'exotic', purposes: ['milk', 'dual'],
    summary: 'A zebu dairy breed valued in warm areas for combining useful milk with heat and tick tolerance.',
    size: 'Medium. Mature cows commonly 350 to 450 kg.', production: 'Moderate milk yield, lower than Friesian but achieved on less feed.',
    heat: 3, feedDemand: 2, management: 2,
    strengths: ['Heat tolerant', 'Considered more tick resistant than European dairy breeds', 'Good fit for semi-arid dairy and for crossbreeding'],
    limits: ['Lower volume than Friesian', 'Tick resistance is partial, so tick control is still needed'],
    evidenceNote: GENERAL,
  },
  {
    id: 'ea-zebu', species: 'cattle', name: 'East African Shorthorn Zebu', origin: 'East Africa', type: 'indigenous', purposes: ['dual', 'meat'],
    summary: 'The common local cattle of Kenya: small, resilient and adapted to local feed and disease conditions.',
    size: 'Small. Mature cows commonly 250 to 300 kg.', production: 'Low milk and modest beef, but dependable on very little input.',
    heat: 3, feedDemand: 1, management: 1,
    strengths: ['Very hardy', 'Copes with poor feed and local disease challenges', 'Low cost to keep'],
    limits: ['Low production per animal', 'Slow growth'],
    evidenceNote: 'Relative tolerance to some local diseases is documented in research, but it is not immunity. ' + GENERAL,
  },
  // Goats
  {
    id: 'sea-goat', species: 'goat', name: 'Small East African goat', origin: 'East Africa', type: 'indigenous', purposes: ['meat'],
    summary: 'The common local goat: small, hardy and prolific, often giving twins.',
    size: 'Small. Mature does commonly 25 to 35 kg.', production: 'Modest meat yield. Little milk, mainly for the kids.',
    heat: 3, feedDemand: 1, management: 1,
    strengths: ['Very hardy', 'Often has twins', 'Thrives on browse and low inputs'],
    limits: ['Small body size', 'Slow growth'],
    evidenceNote: GENERAL,
  },
  {
    id: 'galla', species: 'goat', name: 'Galla goat', origin: 'Northern Kenya and the Horn of Africa', type: 'indigenous', purposes: ['meat'],
    summary: 'A larger local meat goat from dry northern areas, widely used in crossbreeding programmes.',
    size: 'Medium. Mature does commonly 35 to 45 kg.', production: 'Better meat yield than the Small East African goat.',
    heat: 3, feedDemand: 1, management: 1,
    strengths: ['Heat and drought tolerant', 'Good size for a local goat', 'Good base for crossbreeding'],
    limits: ['Moderate growth rate', 'Low milk'],
    evidenceNote: GENERAL,
  },
  {
    id: 'boer', species: 'goat', name: 'Boer goat', origin: 'South Africa', type: 'exotic', purposes: ['meat'],
    summary: 'A fast-growing meat goat often crossed with local does to raise growth and carcass size.',
    size: 'Large. Mature does commonly 60 to 75 kg.', production: 'Fast growth and heavy muscling.',
    heat: 2, feedDemand: 2, management: 2,
    strengths: ['Fast growth', 'Good carcass', 'Improves local goats when crossed'],
    limits: ['Needs better feed than local goats', 'Susceptible to parasites without good management', 'Purebreds are costly'],
    evidenceNote: GENERAL,
  },
  {
    id: 'saanen', species: 'goat', name: 'Saanen', origin: 'Saanen valley, Switzerland', type: 'exotic', purposes: ['milk'],
    summary: 'A white, high-yielding dairy goat that does best in zero-grazing in cooler areas.',
    size: 'Large. Mature does commonly 55 to 70 kg.', production: 'Among the highest milk yields of dairy goats.',
    heat: 1, feedDemand: 3, management: 3,
    strengths: ['High milk yield', 'Calm temperament'],
    limits: ['Sunburn and heat stress, so shade is essential', 'Needs high-quality feed and careful health care'],
    evidenceNote: GENERAL,
  },
  {
    id: 'toggenburg', species: 'goat', name: 'Toggenburg', origin: 'Toggenburg valley, Switzerland', type: 'exotic', purposes: ['milk'],
    summary: 'A brown dairy goat with white markings. Hardy for a dairy breed and widely kept by smallholders.',
    size: 'Medium. Mature does commonly 45 to 60 kg.', production: 'Good milk yield, a little less than Saanen.',
    heat: 2, feedDemand: 2, management: 2,
    strengths: ['Hardy dairy goat', 'Well suited to smallholder zero-grazing'],
    limits: ['Needs good feed and parasite control', 'Less suited to very hot, dry areas'],
    evidenceNote: GENERAL,
  },
  {
    id: 'alpine', species: 'goat', name: 'German Alpine', origin: 'Alpine region, Europe', type: 'exotic', purposes: ['milk'],
    summary: 'An adaptable dairy goat available in many colours, popular in Kenyan crossbreeding.',
    size: 'Medium to large. Mature does commonly 50 to 65 kg.', production: 'Good milk yield.',
    heat: 2, feedDemand: 2, management: 2,
    strengths: ['Adaptable', 'Good milk yield', 'Crosses well with local goats'],
    limits: ['Needs good feed and care', 'Less suited to very hot, dry areas'],
    evidenceNote: GENERAL,
  },
  {
    id: 'kdpg', species: 'goat', name: 'Kenya Dual Purpose Goat', origin: 'Kenya', type: 'composite', purposes: ['dual'],
    summary: 'A composite goat developed in Kenya to give both useful milk and meat in smallholder systems.',
    size: 'Medium.', production: 'Moderate milk and meat. Figures need confirmation from KALRO.',
    heat: 2, feedDemand: 2, management: 2,
    strengths: ['Combines milk and meat', 'Bred for Kenyan conditions'],
    limits: ['Less widely available', 'Published performance data is limited. Check with KALRO.'],
    evidenceNote: 'Breed details need confirmation from KALRO before this entry is finalised.',
  },
  // Sheep
  {
    id: 'red-maasai', species: 'sheep', name: 'Red Maasai', origin: 'East Africa (Maasai pastoral flocks)', type: 'indigenous', purposes: ['meat'],
    summary: 'A hardy hair sheep of the dry rangelands, with a fat tail and red-brown coat.',
    size: 'Small to medium. Mature ewes commonly 30 to 40 kg.', production: 'Modest meat yield, reliably produced on poor pasture.',
    heat: 3, feedDemand: 1, management: 1,
    strengths: ['Heat and drought tolerant', 'Research reports good resistance to some stomach worms'],
    limits: ['Small size', 'Slow growth', 'Worm resistance is partial, so parasites still need monitoring'],
    evidenceNote: 'Worm resistance is documented in research but varies between flocks. ' + GENERAL,
  },
  {
    id: 'dorper', species: 'sheep', name: 'Dorper', origin: 'South Africa', type: 'exotic', purposes: ['meat'],
    summary: 'A hair sheep bred for dry areas. It grows fast, needs no shearing, and is popular for meat.',
    size: 'Large. Mature ewes commonly 60 to 75 kg.', production: 'Fast growth and good carcass for a sheep.',
    heat: 2, feedDemand: 2, management: 2,
    strengths: ['Fast growth', 'No shearing needed', 'Better adapted to dry heat than wool breeds'],
    limits: ['Needs better feed than local sheep', 'Still needs shade, water and parasite control'],
    evidenceNote: GENERAL,
  },
  // Pigs
  {
    id: 'large-white', species: 'pig', name: 'Large White', origin: 'Yorkshire, England', type: 'exotic', purposes: ['meat'],
    summary: 'A common mother-line and meat pig known for large litters and good growth.',
    size: 'Large. Mature sows commonly 200 to 300 kg.', production: 'Large litters and efficient growth on balanced feed.',
    heat: 1, feedDemand: 3, management: 3,
    strengths: ['Large litters', 'Good mothering', 'Fast growth'],
    limits: ['White skin is prone to sunburn', 'Pigs cannot sweat, so heat stress is a real risk', 'Needs balanced feed and strict biosecurity'],
    evidenceNote: GENERAL,
  },
  {
    id: 'landrace', species: 'pig', name: 'Landrace', origin: 'Denmark', type: 'exotic', purposes: ['meat'],
    summary: 'A long-bodied mother-line pig, frequently crossed with Large White.',
    size: 'Large. Mature sows commonly 200 to 300 kg.', production: 'Large litters and lean carcasses on good feed.',
    heat: 1, feedDemand: 3, management: 3,
    strengths: ['Large litters', 'Lean carcass', 'Good milk for piglets'],
    limits: ['Sensitive to heat and rough handling', 'Needs balanced feed and good housing'],
    evidenceNote: GENERAL,
  },
  {
    id: 'duroc', species: 'pig', name: 'Duroc', origin: 'United States', type: 'exotic', purposes: ['meat'],
    summary: 'A red, sturdy pig mainly used as a sire to improve growth and meat quality in crossbred pigs.',
    size: 'Large. Mature sows commonly 200 to 300 kg.', production: 'Fast growth and good meat quality. Smaller litters than Large White or Landrace.',
    heat: 2, feedDemand: 3, management: 2,
    strengths: ['Fast growth', 'Good meat quality', 'Sturdy'],
    limits: ['Smaller litters, so it is usually a sire line', 'Needs balanced feed and good housing'],
    evidenceNote: GENERAL,
  },
  // Chickens
  {
    id: 'kienyeji', species: 'chicken', name: 'Indigenous (kienyeji) chicken', origin: 'Kenya (local ecotypes)', type: 'indigenous', purposes: ['dual'],
    summary: 'Local free-range chickens: variable in looks, hardy, good brooders, and low cost to keep.',
    size: 'Small. Hens commonly 1.0 to 1.5 kg.', production: 'Low egg output, often well under 100 eggs a year, with slow growth.',
    heat: 3, feedDemand: 1, management: 1,
    strengths: ['Hardy and scavenge well', 'Good mothers that hatch their own eggs', 'Low input cost', 'Strong consumer demand'],
    limits: ['Low egg and meat output', 'Slow growth', 'Vulnerable to Newcastle disease without vaccination'],
    evidenceNote: GENERAL,
  },
  {
    id: 'kuroiler', species: 'chicken', name: 'Kuroiler', origin: 'India (Keggfarms), now in East Africa', type: 'hybrid', purposes: ['dual'],
    summary: 'A commercial dual-purpose hybrid sold to scavenging smallholders. It grows and lays better than local chickens.',
    size: 'Medium. Hens commonly 2 to 2.5 kg.', production: 'Reported to lay roughly 150 to 200 eggs a year with good feeding. Claims vary, so ask suppliers for farm-level evidence.',
    heat: 2, feedDemand: 2, management: 2,
    strengths: ['Better growth and laying than kienyeji', 'Copes with free-range systems'],
    limits: ['Hybrid chicks do not breed true, so buy chicks from a reliable hatchery', 'Needs better feeding than kienyeji', 'Not a GMO. It is a conventional hybrid'],
    evidenceNote: 'Performance claims vary between sources. Needs review against local trial data.',
  },
  {
    id: 'kenbro', species: 'chicken', name: 'Kenbro', origin: 'Kenya (Kenchic)', type: 'hybrid', purposes: ['dual'],
    summary: 'A Kenyan-sold improved-kienyeji hybrid aimed at smallholders who want faster growth than local chickens.',
    size: 'Medium.', production: 'Faster growth and better laying than kienyeji. Check current figures with the supplier.',
    heat: 2, feedDemand: 2, management: 2,
    strengths: ['Faster growth than kienyeji', 'Locally supplied chicks'],
    limits: ['Hybrid offspring do not breed true', 'Needs better feeding and vaccination than kienyeji'],
    evidenceNote: 'Details are supplier-reported and need independent verification.',
  },
  {
    id: 'sasso', species: 'chicken', name: 'Sasso', origin: 'France', type: 'hybrid', purposes: ['dual', 'meat'],
    summary: 'A slow-growing coloured hybrid suited to free-range meat and some egg production.',
    size: 'Medium to large.', production: 'Slower growth than commercial broilers but faster than kienyeji, with better hardiness than broilers.',
    heat: 2, feedDemand: 2, management: 2,
    strengths: ['Hardier than commercial broilers', 'Good meat quality when free range'],
    limits: ['Hybrid chicks do not breed true', 'Needs reliable chick supply and vaccination'],
    evidenceNote: GENERAL,
  },
  {
    id: 'rir', species: 'chicken', name: 'Rhode Island Red', origin: 'United States', type: 'exotic', purposes: ['dual', 'eggs'],
    summary: 'A long-established dual-purpose breed that lays brown eggs and is often crossed with local hens.',
    size: 'Medium. Hens commonly 2.0 to 2.5 kg.', production: 'Good, steady laying for a dual-purpose breed.',
    heat: 2, feedDemand: 2, management: 2,
    strengths: ['Hardy', 'Brown eggs', 'Breeds true when kept as a pure line'],
    limits: ['Lays fewer eggs than commercial layer hybrids', 'Slower growth than broilers'],
    evidenceNote: GENERAL,
  },
  {
    id: 'layer-hybrid', species: 'chicken', name: 'Commercial layer hybrids', origin: 'Developed by international breeding companies', type: 'hybrid', purposes: ['eggs'],
    summary: 'Bred for maximum egg production in houses with quality feed, lighting and a vaccination programme.',
    size: 'Small to medium.', production: 'Roughly 280 to 320 eggs in the first year of lay when fed and managed correctly.',
    heat: 2, feedDemand: 3, management: 3,
    strengths: ['Very high egg output', 'Efficient feed use for eggs'],
    limits: ['Needs quality layer feed, calcium and a strict vaccination programme', 'Lay drops quickly in heat stress or poor feed', 'Offspring are unreliable, so buy new pullets'],
    evidenceNote: 'Not genetically modified. They are conventional hybrids made by selective breeding. ' + GENERAL,
  },
  {
    id: 'broiler-hybrid', species: 'chicken', name: 'Commercial broiler hybrids', origin: 'Developed by international breeding companies', type: 'hybrid', purposes: ['meat'],
    summary: 'Bred for very fast growth. Birds reach market weight in roughly 5 to 7 weeks on correct feed.',
    size: 'Large.', production: 'Often 1.8 to 2.4 kg live weight in 5 to 7 weeks with good feed and management.',
    heat: 1, feedDemand: 3, management: 3,
    strengths: ['Very fast growth', 'Efficient feed conversion', 'Short production cycle'],
    limits: ['Heat stress can kill quickly', 'Needs quality feed, ventilation and strict hygiene', 'Not suited to free-range. Leg and heart problems rise if growth is pushed or feed is poor'],
    evidenceNote: 'Fast growth comes from selective breeding and nutrition. They are not GMOs and do not need growth hormones.',
  },
]

/** Finds a breed record by its stable identifier. */
export function getBreed(id: string): Breed | undefined {
  return BREEDS.find((b) => b.id === id)
}

/** Returns a human-readable breed name, including a safe label for unknown IDs. */
export function breedLabel(id: string): string {
  if (id === 'unknown' || !id) return 'Breed unknown'
  if (id === 'mixed') return 'Mixed or crossbred'
  return getBreed(id)?.name ?? id
}

export const PURPOSE_LABEL: Record<Purpose, string> = {
  milk: 'Milk',
  meat: 'Meat',
  eggs: 'Eggs',
  dual: 'Dual purpose',
}

export const TYPE_LABEL: Record<BreedType, string> = {
  indigenous: 'Indigenous',
  exotic: 'Exotic breed',
  composite: 'Composite',
  hybrid: 'Commercial hybrid',
}

export type FitLabel = 'Good fit' | 'Possible' | 'Needs care'
export interface Fit {
  breed: Breed
  score: number
  label: FitLabel
  pros: string[]
  cons: string[]
}

export interface FitInput {
  species: SpeciesId
  goal: Purpose
  climate: 'hot' | 'warm-humid' | 'cool'
  management: 1 | 2 | 3
  feed: 1 | 2 | 3
}

/** A goal-based match, not a ranking. It cannot see disease, availability or price. */
/** Scores breeds against the farmer's species, goal, climate, and input capacity. */
export function matchBreeds(inp: FitInput): Fit[] {
  return BREEDS.filter((b) => b.species === inp.species).map((breed) => {
    let score = 0
    const pros: string[] = []
    const cons: string[] = []
    if (breed.purposes.includes(inp.goal)) {
      score += 3
      pros.push(`Bred for ${PURPOSE_LABEL[inp.goal].toLowerCase()}`)
    } else if (breed.purposes.includes('dual') && inp.goal !== 'dual') {
      score += 1
      pros.push('Dual purpose, so a compromise for this goal')
    } else {
      score -= 3
      cons.push(`Not mainly bred for ${PURPOSE_LABEL[inp.goal].toLowerCase()}`)
    }
    if (inp.climate === 'hot') {
      if (breed.heat === 3) { score += 2; pros.push('Tolerates heat well') }
      else if (breed.heat === 1) { score -= 2; cons.push('Struggles in heat') }
    } else if (inp.climate === 'warm-humid') {
      if (breed.heat === 3) { score += 1; pros.push('Copes well with warm conditions') }
      else if (breed.heat === 1) { score -= 1; cons.push('Can struggle in warm, humid weather') }
    }
    const mgmtGap = breed.management - inp.management
    if (mgmtGap === 1) { score -= 1; cons.push('Needs a bit more management than you plan') }
    else if (mgmtGap >= 2) { score -= 3; cons.push('Needs far more management and vet access than you plan') }
    else if (breed.management === 1) pros.push('Thrives with low-input management')
    const feedGap = breed.feedDemand - inp.feed
    if (feedGap === 1) { score -= 1; cons.push('Needs better feed than you expect to have') }
    else if (feedGap >= 2) { score -= 3; cons.push('Needs much better feed than you expect to have') }
    if (mgmtGap <= 0 && feedGap <= 0) {
      score += 1
      pros.push('Its needs fit the feed and management you have')
    }
    const label: FitLabel = score >= 4 ? 'Good fit' : score >= 1 ? 'Possible' : 'Needs care'
    return { breed, score, label, pros, cons }
  }).sort((a, b) => b.score - a.score)
}
