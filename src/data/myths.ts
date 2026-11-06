export type Verdict = 'myth' | 'fact' | 'partly'
export type MythTopic = 'Genetics and breeds' | 'Feeding' | 'Health and medicine' | 'Breeding' | 'Food safety'

export interface Myth {
  id: string
  claim: string
  verdict: Verdict
  topic: MythTopic
  explanation: string
  practical: string
  evidence: 'strong' | 'moderate' | 'limited'
  sourceHint: string
}

export const VERDICT_LABEL: Record<Verdict, string> = { myth: 'Myth', fact: 'Fact', partly: 'Partly true' }

export const MYTHS: Myth[] = [
  { id: 'hybrid-gmo', claim: 'Hybrid chickens are genetically modified (GMO).', verdict: 'myth', topic: 'Genetics and breeds', evidence: 'strong', sourceHint: 'FAO and breed company information; general genetics',
    explanation: 'Commercial hybrid layers and broilers are made by conventional breeding: choosing and crossing selected lines over many generations. GMO means direct changes to DNA in a laboratory, which is a different process.',
    practical: 'You can buy hybrid chicks without worrying about "GMO", but expect that their own chicks will not perform like the parents.' },
  { id: 'broiler-hormones', claim: 'Broiler chickens grow fast because they are given hormones.', verdict: 'myth', topic: 'Genetics and breeds', evidence: 'strong', sourceHint: 'FAO poultry production guidance',
    explanation: 'Broilers grow quickly because of generations of selective breeding and high-quality feed. Routine hormone injections are not how commercial broilers are raised.',
    practical: 'Fast growth needs the right feed, heat control and hygiene. Poor management, not "lack of hormones", is the usual reason birds grow slowly.' },
  { id: 'crossbred-better', claim: 'Crossbred animals always perform better than purebreds or local breeds.', verdict: 'partly', topic: 'Genetics and breeds', evidence: 'moderate', sourceHint: 'KALRO and general animal breeding research',
    explanation: 'Crossbreeding can give hybrid vigour, but a crossbred only performs well if its feed, housing and health care match its needs. On poor feed, a hardy local breed can do better.',
    practical: 'Choose a breed or cross that fits the feed, water, housing and vet services you actually have.' },
  { id: 'looks-purebred', claim: 'You can tell a purebred animal by how it looks.', verdict: 'myth', topic: 'Genetics and breeds', evidence: 'strong', sourceHint: 'Breed society practice; general genetics',
    explanation: 'Many crossbred animals look like purebreds, especially after several generations of grading up. Only a registry record or a DNA test can confirm breed purity.',
    practical: 'Ask for a pedigree certificate before paying a purebred price. Record the status as "claimed, not verified" if you have no document.' },
  { id: 'inbreeding-ok', claim: 'Mating close relatives is fine if the animals look healthy.', verdict: 'myth', topic: 'Breeding', evidence: 'strong', sourceHint: 'FAO animal genetics guidance',
    explanation: 'Harm from inbreeding can be hidden in the parents and appear in offspring: lower fertility, weak or deformed young and poorer survival.',
    practical: 'Keep records of sire and dam, avoid mating parent to offspring or siblings, and bring in unrelated breeding males or use AI.' },
  { id: 'heifer-age', claim: 'A heifer can be bred as soon as she first shows heat.', verdict: 'myth', topic: 'Breeding', evidence: 'moderate', sourceHint: 'Dairy extension guidance',
    explanation: 'Breeding too young or too light can cause calving difficulty and stunted growth. Heifers do best when bred at about 60 to 65% of their expected adult weight.',
    practical: 'Weigh or measure heifers. Use Farmacare\'s weight records to track growth before breeding.' },
  { id: 'no-rooster', claim: 'Hens cannot lay eggs unless there is a rooster.', verdict: 'myth', topic: 'Food safety', evidence: 'strong', sourceHint: 'Basic poultry biology',
    explanation: 'Hens lay eggs without a rooster. A rooster is needed only if you want fertile eggs that can hatch.',
    practical: 'Keep roosters only if you want to hatch chicks. Eggs for eating do not need them.' },
  { id: 'brown-eggs', claim: 'Brown or "kienyeji" eggs are much more nutritious than white eggs.', verdict: 'partly', topic: 'Food safety', evidence: 'moderate', sourceHint: 'General poultry nutrition research',
    explanation: 'Shell colour depends on the hen\'s breed and does not change nutrition. Egg quality is influenced mostly by what the hen eats and how she is kept.',
    practical: 'Choose eggs for freshness, cleanliness and safe handling rather than shell colour.' },
  { id: 'raw-milk', claim: 'Milk from a healthy-looking cow is safe to drink without boiling.', verdict: 'myth', topic: 'Food safety', evidence: 'strong', sourceHint: 'WOAH and FAO zoonosis guidance',
    explanation: 'Animals can carry germs, such as brucella and TB bacteria, without looking sick. Raw milk can pass these to people.',
    practical: 'Boil milk, or buy pasteurised milk, especially for children, pregnant women and elderly people.' },
  { id: 'withdrawal', claim: 'Milk or meat is safe to sell as soon as the animal looks better after treatment.', verdict: 'myth', topic: 'Health and medicine', evidence: 'strong', sourceHint: 'WOAH and veterinary medicine labelling',
    explanation: 'Drugs stay in milk, meat and eggs for a time after treatment, even when the animal looks well. The withdrawal period on the label or from your vet says how long to wait.',
    practical: 'Record every treatment with its withdrawal days in Farmacare. The Home screen reminds you which animals are still in a withdrawal period.' },
  { id: 'routine-antibiotics', claim: 'Giving antibiotics regularly keeps animals healthy and makes them grow faster.', verdict: 'myth', topic: 'Health and medicine', evidence: 'strong', sourceHint: 'WOAH and FAO antimicrobial resistance guidance',
    explanation: 'Routine or unnecessary antibiotic use helps germs become resistant, so the drugs stop working for you and for people. Good hygiene, nutrition and vaccination prevent disease better.',
    practical: 'Use antibiotics only when a vet advises, finish the full course, and invest in clean housing and vaccination.' },
  { id: 'fixed-deworm', claim: 'Every animal should be dewormed on the same fixed calendar.', verdict: 'myth', topic: 'Health and medicine', evidence: 'moderate', sourceHint: 'FAO and veterinary parasitology guidance',
    explanation: 'Worm burdens differ between animals, seasons and pastures. Treating everyone on a fixed schedule speeds up drug resistance.',
    practical: 'Ask your vet about checking animals first, treating those who need it, and rotating pasture.' },
  { id: 'colostrum', claim: 'The first milk (colostrum) is dirty and should be thrown away.', verdict: 'myth', topic: 'Feeding', evidence: 'strong', sourceHint: 'Veterinary and dairy extension guidance',
    explanation: 'Colostrum is thick, antibody-rich milk that protects newborns, who are born with almost no immunity. Calves, kids, lambs and piglets that miss it are much more likely to get sick.',
    practical: 'Make sure every newborn drinks colostrum soon after birth, ideally within the first few hours.' },
  { id: 'pig-swill', claim: 'Pigs can safely eat any kitchen leftovers, including raw meat scraps.', verdict: 'myth', topic: 'Feeding', evidence: 'strong', sourceHint: 'WOAH African swine fever guidance',
    explanation: 'Uncooked meat scraps can carry viruses, including African swine fever, which has no vaccine and can wipe out a herd. Feeding food waste to pigs is restricted in many places for this reason.',
    practical: 'Feed pigs a balanced ration. Keep meat scraps away from them. Ask your vet what is allowed locally.' },
  { id: 'goats-eat-anything', claim: 'Goats can eat anything.', verdict: 'myth', topic: 'Feeding', evidence: 'moderate', sourceHint: 'FAO small ruminant guidance',
    explanation: 'Goats are picky browsers that choose the best leaves and avoid dirty or contaminated feed. They can still be poisoned by some plants, mouldy feed, plastic or sudden diet changes.',
    practical: 'Use raised feeders, keep feed clean, remove poisonous plants and change diets gradually.' },
  { id: 'heat-signs-pregnant', claim: 'A cow that shows heat signs is definitely not pregnant.', verdict: 'partly', topic: 'Breeding', evidence: 'moderate', sourceHint: 'Dairy reproduction extension guidance',
    explanation: 'Return to heat usually means no pregnancy, but a small number of pregnant cows show heat signs, and some open cows show none. Neither is proof.',
    practical: 'Have a vet or trained worker confirm pregnancy before making decisions. Do not inject or breed again without confirmation.' },
]
