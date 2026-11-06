import type { SpeciesId } from '../types'

export interface FeedGuide {
  id: string
  species: SpeciesId
  title: string
  stage: string
  /** inclusive age range in months that this guide applies to */
  ageMonths: [number, number]
  /** extra condition needed for an automatic match */
  needs?: 'pregnant' | 'lactating' | 'female' | 'male'
  summary: string
  points: string[]
  avoid: string[]
}

export const FEED_GUIDES: FeedGuide[] = [
  {
    id: 'cattle-calf', species: 'cattle', title: 'Calves', stage: 'Birth to about 6 months', ageMonths: [0, 6],
    summary: 'The first hours and weeks decide a calf\'s health. Colostrum, clean water and gradual change to solid feed matter most.',
    points: [
      'Give colostrum (the first milk) as soon as possible after birth, ideally within the first few hours. It carries the antibodies the calf needs.',
      'Feed clean milk or a good milk replacer at regular times, using clean buckets and teats.',
      'Offer clean water from the first days, and good-quality hay or soft forage plus a calf starter from the first weeks so the stomach develops.',
      'Wean when the calf eats enough solid feed, not by age alone. Your vet or extension officer can advise on timing.',
    ],
    avoid: ['Dirty feeding equipment, a common cause of scours', 'Sudden changes in milk amount or feed', 'Mouldy hay or feed'],
  },
  {
    id: 'cattle-growing', species: 'cattle', title: 'Growing heifers and young bulls', stage: 'About 6 to 24 months', ageMonths: [6, 24],
    summary: 'Steady growth on good forage prepares heifers for a first calf at the right weight and age.',
    points: [
      'Base the diet on good forage such as Napier, Rhodes or other grasses, hay, and legumes like desmodium or lucerne.',
      'Supplement protein and minerals if the forage is poor, especially in the dry season.',
      'Aim for steady growth. Breed heifers by weight and condition (about 60 to 65% of expected adult weight), not just age.',
      'Always provide clean water and a mineral lick.',
    ],
    avoid: ['Letting heifers get too fat, which can harm future milk production and calving', 'Starving through the dry season, which delays first breeding'],
  },
  {
    id: 'cattle-lactating', species: 'cattle', title: 'Milking cows', stage: 'Lactating adult cows', ageMonths: [18, 240], needs: 'lactating',
    summary: 'A cow making milk needs a lot of energy, protein, minerals and especially water.',
    points: [
      'Make good forage the base: Napier, silage or hay, with a protein legume where possible.',
      'Add a dairy concentrate in proportion to milk yield. Ask your extension officer or nutritionist for amounts for your cow and feed.',
      'Give clean water at all times. A milking cow drinks many times more than a dry cow.',
      'Provide salt and a suitable mineral mix.',
      'Change feeds gradually over several days.',
    ],
    avoid: ['Large amounts of concentrate with too little fibre, which can cause acidosis', 'Mouldy or wet feed', 'Sudden feed changes'],
  },
  {
    id: 'cattle-dry', species: 'cattle', title: 'Pregnant and dry cows', stage: 'Late pregnancy and dry period', ageMonths: [18, 240], needs: 'pregnant',
    summary: 'The dry period lets the udder rest and the cow rebuild condition for the next lactation.',
    points: [
      'Keep her in good, not fat, body condition on quality forage and minerals.',
      'Ask your vet or nutritionist about transition feeding in the last 3 weeks before calving.',
      'Keep water clean and available.',
    ],
    avoid: ['Overfeeding concentrate, which raises the risk of calving and metabolic problems', 'Sudden feed changes close to calving'],
  },
  {
    id: 'cattle-adult', species: 'cattle', title: 'Adult beef and dry cattle', stage: 'Adults not milking', ageMonths: [24, 240],
    summary: 'Forage and water do most of the work. Plan ahead for the dry season.',
    points: [
      'Rotate grazing so pasture can recover. Conserve hay or silage for dry months.',
      'Provide a mineral lick and clean water year-round.',
      'Add protein supplements in the dry season if body condition falls.',
    ],
    avoid: ['Overgrazing, which weakens pasture and invites weeds', 'Relying on dry-season grass alone'],
  },
  {
    id: 'goat-kid', species: 'goat', title: 'Kids', stage: 'Birth to about 4 months', ageMonths: [0, 4],
    summary: 'Kids need colostrum quickly, steady milk, and soft forage to grow rumen early.',
    points: [
      'Make sure each kid drinks colostrum within the first hours.',
      'Keep kids with the doe or bottle-feed clean milk at regular times.',
      'Offer clean water, soft hay and tender browse from the first couple of weeks.',
      'Wean when kids are eating enough solid feed and are well grown.',
    ],
    avoid: ['Wet, cold bedding, which causes pneumonia and scours', 'Dirty feeders and bottles'],
  },
  {
    id: 'goat-grower', species: 'goat', title: 'Growing goats', stage: 'About 4 to 12 months', ageMonths: [4, 12],
    summary: 'Good browse and minerals support growth. Parasites are a major risk at this age.',
    points: [
      'Offer a mix of grass, browse and legume fodder such as calliandra or desmodium.',
      'Provide a mineral lick and clean water.',
      'Watch for pale eyelids, weakness and poor growth, which can signal worms. Ask a vet about a parasite plan.',
    ],
    avoid: ['Grazing on the same wet, heavily grazed ground repeatedly', 'Feeding on the ground, where goats pick up worms'],
  },
  {
    id: 'goat-adult', species: 'goat', title: 'Adult, pregnant and milking goats', stage: 'Adults', ageMonths: [12, 180],
    summary: 'Goats are selective browsers. Late pregnancy and lactation raise energy, protein and mineral needs.',
    points: [
      'Give good browse, hay and quality forage. Raise concentrate and legume fodder in late pregnancy and in milk.',
      'Provide minerals, salt and constant clean water.',
      'Use raised feeders to keep feed clean.',
      'Introduce new feeds gradually.',
    ],
    avoid: ['Mouldy feed', 'Sudden large changes in concentrate', 'Contaminated water'],
  },
  {
    id: 'sheep-lamb', species: 'sheep', title: 'Lambs', stage: 'Birth to about 4 months', ageMonths: [0, 4],
    summary: 'Colostrum, warmth and clean milk start lambs well, followed by good pasture.',
    points: [
      'Make sure each lamb gets colostrum soon after birth.',
      'Keep lambs dry and out of draughts.',
      'Offer soft forage and clean water from the first weeks.',
    ],
    avoid: ['Wet, cold bedding', 'Heavy worm burdens on wet pasture'],
  },
  {
    id: 'sheep-adult', species: 'sheep', title: 'Growing and adult sheep', stage: 'Over 4 months', ageMonths: [4, 180],
    summary: 'Pasture and minerals suit most sheep. The last weeks of pregnancy need extra attention.',
    points: [
      'Rotate pasture to break parasite cycles and let grass recover.',
      'Provide a mineral lick and clean water.',
      'Increase feed quality in the last 5 to 6 weeks of pregnancy, and in early lactation.',
    ],
    avoid: ['Copper-heavy mineral mixes that are made for other species. Ask a vet before using any', 'Overgrazing short pasture'],
  },
  {
    id: 'pig-piglet', species: 'pig', title: 'Piglets', stage: 'Birth to about 2 months', ageMonths: [0, 2],
    summary: 'Piglets need colostrum, warmth and then a good creep feed before weaning.',
    points: [
      'Ensure every piglet suckles colostrum soon after birth.',
      'Keep piglets warm and dry, with a heated or sheltered creep area away from the sow.',
      'Offer a creep feed designed for piglets and clean water before weaning.',
    ],
    avoid: ['Cold, damp, draughty floors', 'Weaning on a sudden diet change'],
  },
  {
    id: 'pig-grower', species: 'pig', title: 'Weaners and growing pigs', stage: 'About 2 to 6 months', ageMonths: [2, 6],
    summary: 'Pigs need a balanced feed made for their stage. Forage alone does not meet their needs.',
    points: [
      'Use a balanced weaner, grower or finisher feed from a trusted source, or a ration formulated by a nutritionist.',
      'Provide clean water at all times.',
      'Clean feeders daily and keep feed dry.',
    ],
    avoid: ['Feeding raw kitchen leftovers or any uncooked meat scraps. This can spread diseases including African swine fever', 'Mouldy or contaminated feed'],
  },
  {
    id: 'pig-sow', species: 'pig', title: 'Sows and boars', stage: 'Breeding adults', ageMonths: [6, 120],
    summary: 'Feeding changes between pregnancy and lactation. Over-fat sows farrow poorly, and under-fed sows lose condition.',
    points: [
      'Feed to keep sows in good body condition through pregnancy.',
      'Increase feed after farrowing. A lactating sow needs much more feed and water.',
      'Provide clean water at all times.',
    ],
    avoid: ['Letting sows become fat', 'Sudden feed changes before or after farrowing', 'Raw kitchen leftovers or uncooked meat scraps'],
  },
  {
    id: 'chicken-chick', species: 'chicken', title: 'Chicks', stage: 'Day-old to about 2 months', ageMonths: [0, 2],
    summary: 'Warmth, clean water and the right starter feed give chicks a strong start.',
    points: [
      'Provide a warm, dry, draught-free brooder before chicks arrive.',
      'Offer clean water and a chick starter feed from the first day.',
      'Keep feeders and drinkers clean and at chick height.',
    ],
    avoid: ['Cold or overheated brooders', 'Dirty, wet litter', 'Adult or layer feed, which is the wrong balance for chicks'],
  },
  {
    id: 'chicken-grower', species: 'chicken', title: 'Growing birds', stage: 'About 2 to 5 months', ageMonths: [2, 5],
    summary: 'Growers need feed suited to growth, not laying. Keep them clean and uncrowded.',
    points: [
      'Move to a grower feed at the suggested age for your breed.',
      'Provide clean water and enough feeder space so smaller birds are not pushed out.',
      'Provide shelter, fresh air and dry litter.',
    ],
    avoid: ['Overcrowding', 'Giving layer feed too early, because the extra calcium is harmful to growing birds'],
  },
  {
    id: 'chicken-layer', species: 'chicken', title: 'Laying hens', stage: 'From about 5 months', ageMonths: [5, 120], needs: 'female',
    summary: 'Layers need a complete layer feed with enough calcium for strong eggshells, plus plenty of clean water.',
    points: [
      'Use a complete layer feed, or ask a nutritionist about a balanced ration for scavenging birds.',
      'Provide a calcium source such as limestone grit or crushed shell, separately if needed.',
      'Provide clean water all day. Water shortage cuts egg production fast.',
      'Store feed dry, off the floor and in a ventilated place.',
    ],
    avoid: ['Mouldy feed. Aflatoxin harms birds and can enter eggs and meat', 'Sudden feed changes', 'Heat and water shortage'],
  },
]

export interface Ingredient {
  id: string
  name: string
  type: 'forage' | 'protein' | 'energy' | 'mineral'
  species: string
  purpose: string
  caution: string
}

export const INGREDIENTS: Ingredient[] = [
  { id: 'napier', name: 'Napier grass', type: 'forage', species: 'Cattle, goats', purpose: 'High-yielding fodder grass, cut and carried or ensiled.', caution: 'Cut at the right height. Very old, stemmy grass is less digestible. Wilt wet grass before feeding to reduce bloat risk.' },
  { id: 'desmodium', name: 'Desmodium', type: 'forage', species: 'Cattle, goats', purpose: 'Protein-rich legume that grows well with Napier and improves feed quality.', caution: 'Mix with grass rather than feeding as the whole diet.' },
  { id: 'lucerne', name: 'Lucerne (alfalfa)', type: 'forage', species: 'Cattle, goats, sheep', purpose: 'High-protein hay or green fodder.', caution: 'Fresh lush lucerne can cause bloat in ruminants. Wilt or mix with grass.' },
  { id: 'calliandra', name: 'Calliandra', type: 'protein', species: 'Cattle, goats', purpose: 'Fodder shrub with high protein leaves, good as a supplement.', caution: 'Feed as a supplement alongside other feed. Introduce gradually.' },
  { id: 'hay-silage', name: 'Hay and silage', type: 'forage', species: 'Cattle, goats, sheep', purpose: 'Conserved feed for the dry season.', caution: 'Poorly made hay or silage can be mouldy or spoiled. Discard anything with mould or a bad smell.' },
  { id: 'brans', name: 'Maize bran and wheat bran', type: 'energy', species: 'Cattle, goats, pigs, chickens', purpose: 'Common energy and fibre supplements.', caution: 'Store dry. Damp bran grows mould quickly.' },
  { id: 'seedcakes', name: 'Sunflower and cottonseed cake', type: 'protein', species: 'Cattle, goats, sheep (cottonseed cake with care)', purpose: 'Protein supplements for milking and growing animals.', caution: 'Cottonseed cake contains gossypol, which can harm young animals and non-ruminants. Ask your vet or nutritionist about safe amounts.' },
  { id: 'omena', name: 'Fish meal (omena or dagaa)', type: 'protein', species: 'Pigs, chickens', purpose: 'Protein and minerals for poultry and pig rations.', caution: 'Quality varies and adulterated products exist. Buy from trusted suppliers.' },
  { id: 'soya', name: 'Soya bean meal', type: 'protein', species: 'Pigs, chickens, calves', purpose: 'High-quality plant protein for non-ruminants.', caution: 'Raw soya beans are not safe to feed. They must be heat-processed.' },
  { id: 'lime', name: 'Limestone or crushed shell', type: 'mineral', species: 'Laying hens, all species as part of minerals', purpose: 'Calcium for eggshells and bones.', caution: 'Too much calcium can upset growing animals. Follow your supplier\'s or nutritionist\'s guidance.' },
  { id: 'salt-lick', name: 'Salt and mineral lick', type: 'mineral', species: 'Cattle, goats, sheep', purpose: 'Supplies sodium and trace minerals missing from pasture.', caution: 'Use a mix made for the right species. Some sheep and goat mixes differ from cattle mixes.' },
]

export interface Suggestion {
  guide: FeedGuide
  reason: string
}

/** Suggest feeding guides that fit an animal's age, sex and reproductive state. */
/** Selects general feeding guides that match an animal's species, age, and state. */
export function suggestFeeding(
  species: SpeciesId,
  ageMonths: number | undefined,
  sex: string,
  pregnant: boolean,
  lactating: boolean,
): Suggestion[] {
  if (ageMonths === undefined) return []
  const out: Suggestion[] = []
  for (const g of FEED_GUIDES.filter((x) => x.species === species)) {
    if (ageMonths < g.ageMonths[0] || ageMonths > g.ageMonths[1]) continue
    if (g.needs === 'pregnant' && !pregnant) continue
    if (g.needs === 'lactating' && !lactating) continue
    if (g.needs === 'female' && sex !== 'female') continue
    if (g.needs === 'male' && sex !== 'male') continue
    out.push({ guide: g, reason: g.needs ? 'Matches age and reproductive state' : 'Matches age' })
  }
  // cattle: avoid showing generic adult guide alongside lactating/dry guide
  if (out.some((s) => s.guide.id === 'cattle-lactating' || s.guide.id === 'cattle-dry'))
    return out.filter((s) => s.guide.id !== 'cattle-adult' && s.guide.id !== 'cattle-growing')
  return out
}
