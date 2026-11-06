import type { SpeciesId } from '../types'

export interface Disease {
  name: string
  species: SpeciesId[]
  what: string
  prevention: string
  report?: boolean
}

export const DISEASES: Disease[] = [
  { name: 'Foot and mouth disease (FMD)', species: ['cattle', 'goat', 'sheep', 'pig'], what: 'Highly contagious. Blisters on the mouth and feet, drooling, lameness and a drop in milk.', prevention: 'Vaccination in recommended areas, movement control and quarantine for new animals.', report: true },
  { name: 'Lumpy skin disease', species: ['cattle'], what: 'Fever and firm skin nodules, spread mainly by biting insects.', prevention: 'Vaccination, insect control and avoiding contact with infected herds.' },
  { name: 'East Coast fever (ECF) and other tick-borne diseases', species: ['cattle'], what: 'Spread by ticks. Fever, swollen glands, weakness and often death if untreated.', prevention: 'Regular tick control. Ask your vet about immunisation (infection and treatment method) in your area.' },
  { name: 'Anthrax', species: ['cattle', 'goat', 'sheep'], what: 'Sudden death, sometimes with bleeding from the nose or anus. It can infect people.', prevention: 'Annual vaccination in risk areas. Do not open or skin a suspected carcass. Report it at once.', report: true },
  { name: 'Brucellosis', species: ['cattle', 'goat', 'sheep', 'pig'], what: 'Causes abortion and infertility, and spreads to people through raw milk and birth fluids.', prevention: 'Test and cull on vet advice, vaccinate where recommended, boil milk, and wear gloves at births.' },
  { name: 'Mastitis', species: ['cattle', 'goat'], what: 'Infection of the udder: swollen, hot or painful udder, clots or watery milk.', prevention: 'Clean milking routine, dry bedding, teat dipping, and prompt vet advice. Observe withdrawal periods.' },
  { name: 'Peste des petits ruminants (PPR)', species: ['goat', 'sheep'], what: 'Fever, discharge from eyes and nose, mouth sores and diarrhoea, often fatal in young animals.', prevention: 'Vaccination, quarantine of new animals, and reporting outbreaks.', report: true },
  { name: 'Contagious caprine pleuropneumonia (CCPP)', species: ['goat'], what: 'Serious lung disease with coughing, laboured breathing and fever.', prevention: 'Vaccination in risk areas and quarantine of new goats.', report: true },
  { name: 'Enterotoxaemia (overeating disease)', species: ['goat', 'sheep', 'cattle'], what: 'Sudden death or bloat and diarrhoea after rapid change to rich feed.', prevention: 'Change feed gradually and ask your vet about vaccination.' },
  { name: 'African swine fever (ASF)', species: ['pig'], what: 'High fever, red or purple skin, and rapid death. There is no vaccine.', prevention: 'Strict biosecurity: no uncooked meat scraps, no visitors in pig areas, no shared equipment. Report suspected cases at once.', report: true },
  { name: 'Newcastle disease', species: ['chicken'], what: 'Sudden deaths, greenish diarrhoea, twisted necks and falling egg production.', prevention: 'Regular vaccination. Heat-stable vaccines suit village flocks. Keep sick birds away from the flock.' },
  { name: 'Gumboro (infectious bursal disease)', species: ['chicken'], what: 'Young birds become weak, ruffled and have watery diarrhoea.', prevention: 'Vaccination on the schedule your vet or hatchery advises.' },
  { name: 'Coccidiosis', species: ['chicken', 'cattle', 'goat', 'sheep', 'pig'], what: 'Bloody or loose droppings in young animals, especially in wet, dirty conditions.', prevention: 'Keep litter and bedding dry, avoid overcrowding, and ask your vet about prevention.' },
  { name: 'Internal parasites (worms)', species: ['cattle', 'goat', 'sheep', 'pig', 'chicken'], what: 'Poor growth, pale eyelids, bottle jaw, scouring and weakness.', prevention: 'Rotate pasture, avoid overgrazing, keep feeders off the ground, and use dewormers only on veterinary advice to avoid resistance.' },
]

export interface WarningSign {
  level: 'emergency' | 'same-day' | 'isolate'
  sign: string
  note: string
  species: SpeciesId[] | 'all'
}

export const WARNING_SIGNS: WarningSign[] = [
  { level: 'emergency', sign: 'Sudden death of one or more animals, especially with bleeding from nose or anus', note: 'Do not open or move the carcass. Keep people and animals away and report to a vet or sub-county veterinary officer at once. Anthrax is one possibility.', species: ['cattle', 'goat', 'sheep'] },
  { level: 'emergency', sign: 'Bloated, tight left flank and distress', note: 'Bloat can kill within hours. Call a vet immediately and keep the animal on its feet.', species: ['cattle', 'goat', 'sheep'] },
  { level: 'emergency', sign: 'Strong straining for about an hour with no progress, or an abnormal presentation at birth', note: 'Call a vet. Do not pull hard. Keep the animal calm and clean.', species: ['cattle', 'goat', 'sheep', 'pig'] },
  { level: 'emergency', sign: 'Collapse, cannot stand, or severe breathing difficulty', note: 'Call a vet immediately. Move the animal to shade and offer water if it can swallow.', species: 'all' },
  { level: 'emergency', sign: 'Sudden deaths, red or purple skin and high fever in pigs', note: 'African swine fever is possible. Isolate the pen, stop all movement and report immediately.', species: ['pig'] },
  { level: 'emergency', sign: 'Many birds suddenly dead, with greenish diarrhoea or twisted necks', note: 'Newcastle disease and other serious diseases are possible. Isolate, limit movement and call a vet.', species: ['chicken'] },
  { level: 'same-day', sign: 'Not eating or drinking for a day, or very dull and separate from the group', note: 'Take the temperature if you can, provide shade and water, and contact a vet the same day.', species: 'all' },
  { level: 'same-day', sign: 'Blisters or sores on mouth, feet or teats, drooling, or sudden lameness in several animals', note: 'Possible foot and mouth disease. Isolate affected animals and call a vet the same day.', species: ['cattle', 'goat', 'sheep', 'pig'] },
  { level: 'same-day', sign: 'Hot, swollen, painful udder, or clots or blood in milk', note: 'Possible mastitis. Contact a vet. Do not sell or use the milk until advised.', species: ['cattle', 'goat'] },
  { level: 'same-day', sign: 'Bloody diarrhoea, or heavy scouring in young animals', note: 'Young animals dehydrate fast. Keep them warm and drinking, and call a vet.', species: 'all' },
  { level: 'same-day', sign: 'Abortion or stillbirth', note: 'Wear gloves, isolate the animal and the afterbirth, and call a vet. Some causes, such as brucellosis, can infect people.', species: ['cattle', 'goat', 'sheep', 'pig'] },
  { level: 'isolate', sign: 'Coughing, nasal discharge or mild limping that is new', note: 'Separate the animal, watch closely, and call a vet if it does not improve in a day or two or spreads.', species: 'all' },
  { level: 'isolate', sign: 'Pale eyelids, poor growth, weakness or swelling under the jaw', note: 'May indicate worms or anaemia. Ask a vet about testing before treating.', species: ['cattle', 'goat', 'sheep'] },
]

export const PREVENTIVE_PRINCIPLES = [
  { title: 'Know your local vaccination schedule', body: 'Diseases and vaccines differ between counties. Ask your sub-county veterinary officer or a trusted vet which vaccines your animals need and when, then record each one in Farmacare.' },
  { title: 'Quarantine new animals', body: 'Keep newly bought animals apart for at least 2 to 3 weeks and watch for illness before mixing them with the herd or flock.' },
  { title: 'Control ticks, flies and worms', body: 'Use pasture rotation, clean housing and regular checks. Use dewormers and acaricides on veterinary advice, so they keep working.' },
  { title: 'Keep housing clean and dry', body: 'Remove manure often, drain wet areas, and keep feed and water away from droppings.' },
  { title: 'Limit visitors and shared equipment', body: 'People, boots, vehicles and tools can carry disease. Wash hands and boots, and do not share equipment between farms without cleaning it.' },
  { title: 'Use medicines responsibly', body: 'Give medicines only as the vet or the label directs, finish the full course, and record every treatment with its withdrawal period.' },
  { title: 'Report notifiable diseases', body: 'Suspected foot and mouth disease, anthrax, PPR, African swine fever and some others must be reported. Contact your sub-county veterinary officer.' },
]

export const WELFARE = [
  { title: 'Housing and space', body: 'Animals need a dry, ventilated shelter with clean bedding, enough room to stand, lie down comfortably and turn around, and shade from the sun.' },
  { title: 'Feed and water', body: 'Provide appropriate feed for the species and age, and clean water at all times. Check water points every day.' },
  { title: 'Calm handling', body: 'Move animals quietly. Shouting, beating and rough handling cause injury and stress, and lower milk and egg production.' },
  { title: 'Transport', body: 'Avoid the hottest hours, do not overcrowd, provide ventilation, and let animals rest and drink before and after the trip. Never transport very weak, sick or heavily pregnant animals.' },
  { title: 'Newborn care', body: 'Make sure newborns are dry, warm and have drunk colostrum soon after birth. Dip navels in iodine as your vet advises. Keep the birth area clean.' },
  { title: 'Sick or injured animals', body: 'Separate them, give shade and water, and call a vet. Do not leave suffering animals untreated.' },
  { title: 'Responsible breeding', body: 'Breed only animals that are old and well-grown enough, in good health and condition. Avoid mating close relatives, and do not keep breeding animals with repeated birth problems.' },
]

export const FOOD_SAFETY = [
  { title: 'Boil or pasteurise milk', body: 'Raw milk can carry germs that cause brucellosis, TB and severe stomach illness. Boil milk before drinking or giving it to children, or buy pasteurised milk.' },
  { title: 'Respect withdrawal periods', body: 'After a treatment, milk, meat or eggs may carry drug residues for a set time. Do not sell or eat them until the period on the label or from your vet has passed.' },
  { title: 'Cook eggs and meat well', body: 'Cook meat and eggs thoroughly. Wash hands, boards and knives after handling raw meat or eggs.' },
  { title: 'Never eat animals that died of disease', body: 'Do not slaughter or eat animals that died suddenly or look sick. Some diseases, such as anthrax, can infect people.' },
  { title: 'Store feed to prevent mould', body: 'Store grain and feed dry, off the floor and in a ventilated place. Mouldy feed can contain aflatoxin, which harms animals and can pass into milk and eggs.' },
  { title: 'Keep milking and slaughter areas clean', body: 'Use clean containers, clean water and clean hands. Cool milk quickly and keep it covered.' },
]
