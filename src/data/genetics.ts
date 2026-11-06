export interface GeneticTerm {
  id: string
  term: string
  short: string
  detail: string
  example: string
  howToCheck: string
}

export const GENETIC_TERMS: GeneticTerm[] = [
  {
    id: 'purebred', term: 'Purebred',
    short: 'Both parents are the same breed, and the line is recorded by a breed society or registry.',
    detail: 'A purebred animal has ancestors of one breed over several generations, with records. Looking like a breed is not enough: many crossbred animals look purebred.',
    example: 'A Friesian bull with a registered pedigree from a breed society.',
    howToCheck: 'Ask for a registration or pedigree certificate that names the registry, the animal\'s ID, and its sire and dam. If you cannot get one, record the status as "claimed, not verified".',
  },
  {
    id: 'crossbred', term: 'Crossbred',
    short: 'The parents are two different breeds.',
    detail: 'Crossbreeding can combine useful traits and often gives hybrid vigour (heterosis), but results vary and the offspring of crossbreds are less predictable than purebreds.',
    example: 'A Friesian × Sahiwal cow.',
    howToCheck: 'Record both parent breeds if you know them. If you do not, mark it as mixed with unknown parents.',
  },
  {
    id: 'hybrid', term: 'Commercial hybrid',
    short: 'A cross between specially developed lines, produced by a breeding company.',
    detail: 'Most commercial layers, broilers and many "improved" chickens are hybrids. They are made by conventional breeding of selected lines. Their own offspring usually do not perform like the parents, so farmers buy new chicks or pullets each cycle.',
    example: 'Commercial layer chicks, or broiler chicks from a hatchery.',
    howToCheck: 'Buy from a reliable hatchery that names the product line, and keep the supplier\'s invoice or certificate.',
  },
  {
    id: 'selective', term: 'Selective breeding and grading up',
    short: 'Choosing the best animals to breed from, over generations.',
    detail: 'Farmers have always selected for milk, growth, hardiness or temperament. "Grading up" means repeatedly mating crossbred females to purebred sires of one breed, so offspring become more like that breed over generations.',
    example: 'Mating local cows to Sahiwal bulls for several generations.',
    howToCheck: 'Record the generations and which sires were used. A graded-up animal is not purebred, even if it looks like one.',
  },
  {
    id: 'gmo', term: 'GMO (genetically modified or engineered)',
    short: 'An animal whose DNA was changed in a laboratory.',
    detail: 'GMO refers to direct genetic engineering, which is different from crossbreeding and selective breeding. Almost no genetically engineered farm animals are in commercial food production anywhere, and none of the usual breeds and hybrids sold to Kenyan farmers are GMOs. A fast-growing chicken or a high-yielding cow is the result of generations of conventional selection and good feeding.',
    example: 'A broiler chick that grows fast is not a GMO. It comes from conventional breeding.',
    howToCheck: 'Be cautious of claims that a breed is "GMO" with no document. Ask the supplier, and check current regulations with the relevant Kenyan authorities.',
  },
]

export const WHAT_APPEARANCE_CANNOT_TELL = [
  'Whether an animal is purebred. Crossbreds can look very like purebreds.',
  'Whether an animal is a GMO. Genetic engineering cannot be seen.',
  'Who the parents are. Only records, or a DNA test, can show parentage.',
  'Whether two animals are related. Records are the only practical guide on a farm.',
]

export const INBREEDING = {
  title: 'Why inbreeding matters',
  body: 'Mating close relatives, such as parent and offspring or brother and sister, raises the chance that both parents pass on the same harmful gene. This can mean weaker, smaller or deformed offspring, lower fertility and poorer survival. Farmacare warns you when your records show a close relationship. It can only see what you have recorded.',
  tips: [
    'Give every animal a permanent tag and record its sire and dam when known.',
    'Rotate or exchange breeding males between farms or groups, or use AI with unrelated sires.',
    'Do not mate parent to offspring or brother to sister.',
    'Keep records of every mating so future relationships can be checked.',
  ],
}

export type CheckerAnswer = 'yes' | 'no' | 'unsure'

export interface CheckerResult {
  status: 'purebred_documented' | 'purebred_claimed' | 'commercial_hybrid' | 'crossbred' | 'unknown'
  title: string
  advice: string
}

/** Suggests how to record genetic status from three simple answers. It never infers status from looks. */
/** Classifies documentation status without inferring genetics from appearance. */
export function checkGeneticStatus(a: { hatchery: CheckerAnswer; certificate: CheckerAnswer; knownParents: CheckerAnswer }): CheckerResult {
  if (a.certificate === 'yes')
    return { status: 'purebred_documented', title: 'Purebred (documented)', advice: 'You have a registry document. Keep a copy, check that the animal ID on it matches the tag, and tick "pedigree verified" in the animal record.' }
  if (a.hatchery === 'yes')
    return { status: 'commercial_hybrid', title: 'Commercial hybrid', advice: 'Record the product line and supplier. Hybrid birds are conventionally bred and are not GMOs. Do not breed from them expecting the same performance.' }
  if (a.knownParents === 'yes')
    return { status: 'crossbred', title: 'Crossbred or grade (known parents)', advice: 'Record both parent breeds. If both parents were the same registered breed but you have no certificate, record "purebred, claimed" until you get a document.' }
  return { status: 'unknown', title: 'Unknown', advice: 'Record the genetic status as unknown. That is more honest and more useful than a guess, and you can update it later if you find a record.' }
}
