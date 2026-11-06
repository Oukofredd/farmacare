import type { SpeciesId } from '../types'

export interface Milestone {
  /** days after the breeding / egg-setting date */
  day: number
  label: string
  detail: string
}

export interface Species {
  id: SpeciesId
  name: string
  plural: string
  young: string
  birthWord: string
  kind: 'gestation' | 'incubation'
  days: number
  min: number
  max: number
  cycleDays?: number
  startLabel: string
  milestones: Milestone[]
  firstBreeding: string
  productionUnits: { unit: string; label: string }[]
  summary: string
}

export const SPECIES: Species[] = [
  {
    id: 'cattle',
    name: 'Cattle',
    plural: 'cattle',
    young: 'calf',
    birthWord: 'Calving',
    kind: 'gestation',
    days: 283,
    min: 279,
    max: 290,
    cycleDays: 21,
    startLabel: 'Date of mating or AI',
    summary: 'Dairy, beef and dual-purpose cattle. Average pregnancy is about 9 months and 10 days.',
    firstBreeding:
      'Breed heifers when they reach about 60 to 65% of their expected adult weight (often 15 to 18 months with good feeding), not by age alone.',
    productionUnits: [{ unit: 'L', label: 'Milk (litres)' }],
    milestones: [
      { day: 21, label: 'Watch for a return to heat', detail: 'A cow that comes back into heat around day 18 to 24 is probably not pregnant. Not showing heat is not proof of pregnancy.' },
      { day: 60, label: 'Ask a vet to confirm pregnancy', detail: 'Palpation or ultrasound by a vet or trained animal health worker gives a reliable answer.' },
      { day: 223, label: 'Dry-off (dairy cows)', detail: 'Dairy cows are usually dried off about 60 days before calving so the udder can rest. Ask your vet or extension officer what suits your cow.' },
      { day: 262, label: 'Move to a clean calving pen', detail: 'About 3 weeks before the due date: clean, dry, shaded space. Ask your vet or nutritionist about transition feeding.' },
      { day: 273, label: 'Check her several times a day', detail: 'Calving can begin up to about 10 days either side of the average date. Call a vet if she strains hard for about an hour without progress, or the calf is not coming normally.' },
    ],
  },
  {
    id: 'goat',
    name: 'Goats',
    plural: 'goats',
    young: 'kid',
    birthWord: 'Kidding',
    kind: 'gestation',
    days: 150,
    min: 145,
    max: 155,
    cycleDays: 21,
    startLabel: 'Date of mating',
    summary: 'Meat, dairy and dual-purpose goats. Pregnancy lasts about 5 months.',
    firstBreeding:
      'Breed does at about 60 to 70% of expected adult weight (often 8 to 12 months), when they are growing well and in good condition.',
    productionUnits: [{ unit: 'L', label: 'Milk (litres)' }],
    milestones: [
      { day: 21, label: 'Watch for a return to heat', detail: 'Return to heat around day 18 to 24 suggests she is not pregnant.' },
      { day: 45, label: 'Ask a vet to confirm pregnancy', detail: 'Ultrasound by a vet or animal health worker can confirm pregnancy from about this time.' },
      { day: 110, label: 'Feed for the last 6 weeks', detail: 'Kids grow fastest late in pregnancy, so the doe needs better feed and minerals. Ask about pre-kidding vaccination and parasite control.' },
      { day: 140, label: 'Prepare a clean kidding pen', detail: 'Dry bedding, clean towels, iodine for navels, and a plan for warming weak kids.' },
    ],
  },
  {
    id: 'sheep',
    name: 'Sheep',
    plural: 'sheep',
    young: 'lamb',
    birthWord: 'Lambing',
    kind: 'gestation',
    days: 147,
    min: 142,
    max: 152,
    cycleDays: 17,
    startLabel: 'Date of mating',
    summary: 'Hair and wool sheep. Pregnancy lasts about 5 months.',
    firstBreeding:
      'Breed ewe lambs at about 60 to 70% of expected adult weight (often 8 to 12 months), not before they are well grown.',
    productionUnits: [],
    milestones: [
      { day: 17, label: 'Watch for a return to heat', detail: 'Return to heat around day 14 to 19 suggests she is not pregnant.' },
      { day: 45, label: 'Ask a vet to confirm pregnancy', detail: 'Ultrasound can confirm pregnancy and sometimes whether she carries twins.' },
      { day: 110, label: 'Feed for the last 5 weeks', detail: 'Most lamb growth happens late in pregnancy. Ewes carrying twins need extra care with feed.' },
      { day: 140, label: 'Prepare a clean lambing area', detail: 'Dry, sheltered and clean. Have iodine and towels ready.' },
    ],
  },
  {
    id: 'pig',
    name: 'Pigs',
    plural: 'pigs',
    young: 'piglet',
    birthWord: 'Farrowing',
    kind: 'gestation',
    days: 114,
    min: 111,
    max: 118,
    cycleDays: 21,
    startLabel: 'Date of mating or AI',
    summary: 'Pregnancy is about 3 months, 3 weeks and 3 days.',
    firstBreeding:
      'Gilts are usually bred at about 7 to 8 months, well grown, and at their second or third heat rather than the first.',
    productionUnits: [],
    milestones: [
      { day: 21, label: 'Watch for a return to heat', detail: 'Return to heat around day 18 to 24 suggests she is not pregnant.' },
      { day: 28, label: 'Ask a vet to confirm pregnancy', detail: 'Ultrasound can confirm pregnancy from about 4 weeks.' },
      { day: 100, label: 'Plan the farrowing pen', detail: 'Check the pen is repaired, dry, draught-free and has a safe area where piglets can keep warm away from the sow.' },
      { day: 107, label: 'Move the sow to a clean pen', detail: 'About a week before the due date. Wash and disinfect the pen first, and let it dry.' },
    ],
  },
  {
    id: 'chicken',
    name: 'Chickens',
    plural: 'chickens',
    young: 'chick',
    birthWord: 'Hatching',
    kind: 'incubation',
    days: 21,
    min: 20,
    max: 22,
    startLabel: 'Date eggs were set',
    summary: 'Incubation takes about 21 days, whether under a hen or in an incubator.',
    firstBreeding:
      'Hens start laying at roughly 18 to 22 weeks. For fertile eggs, keep roughly one healthy cock to every 8 to 12 hens.',
    productionUnits: [{ unit: 'eggs', label: 'Eggs (count)' }],
    milestones: [
      { day: 7, label: 'Candle the eggs', detail: 'In a dark room, hold a bright light to each egg. Remove clear (infertile) eggs. Keep those showing veins or a dark spot.' },
      { day: 14, label: 'Candle again', detail: 'Remove eggs with no movement or a cloudy, blood-ring look. Removing dead eggs protects the rest.' },
      { day: 18, label: 'Stop turning, leave undisturbed', detail: 'Incubators: stop turning and avoid opening the lid. Broody hens: leave the nest alone.' },
    ],
  },
]

export const SPECIES_IDS = SPECIES.map((s) => s.id)

/** Looks up the fixed species information used by calculators and animal screens. */
export function getSpecies(id: SpeciesId): Species {
  return SPECIES.find((s) => s.id === id) as Species
}
