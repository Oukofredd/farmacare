import type { Animal, AnimalEvent, Db } from '../types'
import { addDays } from '../lib/dates'
import { emptyDb } from '../lib/store'

/** Creates a demo farm whose dates stay relative to today so reminders look live. */
export function sampleDb(today: string): Db {
  const stamp = new Date().toISOString()
  /** Builds a demo animal with shared defaults for fields not specified. */
  const a = (p: Partial<Animal> & Pick<Animal, 'id' | 'tag' | 'species'>): Animal => ({
    breedId: 'unknown', sex: 'female', count: 1, dobEstimated: false, source: 'unknown',
    pedigreeVerified: false, geneticStatus: 'unknown', status: 'active', createdAt: stamp, updatedAt: stamp, ...p,
  })
  /** Builds a demo event with the common creation timestamp. */
  const e = (p: Partial<AnimalEvent> & Pick<AnimalEvent, 'id' | 'animalId' | 'type' | 'date' | 'title'>): AnimalEvent => ({
    createdAt: stamp, ...p,
  })

  const animals: Animal[] = [
    a({ id: 'demo-bull', tag: 'KB-001', name: 'Duke', species: 'cattle', breedId: 'boran', sex: 'male', dob: addDays(today, -365 * 5), source: 'purchased', sourceDetail: 'Bought from a breeder in Laikipia', pedigreeVerified: true, geneticStatus: 'purebred_documented' }),
    a({ id: 'demo-cow1', tag: 'KB-101', name: 'Wanjiru', species: 'cattle', breedId: 'friesian', dob: addDays(today, -365 * 4), source: 'purchased', sourceDetail: 'Bought as a heifer', geneticStatus: 'purebred_claimed' }),
    a({ id: 'demo-cow2', tag: 'KB-102', name: 'Achieng', species: 'cattle', breedId: 'ayrshire', dob: addDays(today, -365 * 5), dobEstimated: true, source: 'born_on_farm', geneticStatus: 'crossbred', sireTag: 'KB-001' }),
    a({ id: 'demo-calf', tag: 'KB-103', name: 'Njeri', species: 'cattle', breedId: 'mixed', dob: addDays(today, -150), source: 'born_on_farm', sireTag: 'KB-001', damTag: 'KB-101', geneticStatus: 'crossbred' }),
    a({ id: 'demo-goat1', tag: 'G-21', species: 'goat', breedId: 'galla', dob: addDays(today, -365 * 2), source: 'purchased', geneticStatus: 'unknown' }),
    a({ id: 'demo-goat2', tag: 'G-22', species: 'goat', breedId: 'toggenburg', dob: addDays(today, -365 * 3), dobEstimated: true, source: 'gift', geneticStatus: 'purebred_claimed' }),
    a({ id: 'demo-flock', tag: 'FLK-A', name: 'Layers, house A', species: 'chicken', breedId: 'kienyeji', count: 40, dob: addDays(today, -240), source: 'purchased', sourceDetail: 'Chicks from a local hatchery', geneticStatus: 'unknown' }),
    a({ id: 'demo-pig', tag: 'P-07', species: 'pig', breedId: 'large-white', dob: addDays(today, -200), source: 'unknown', geneticStatus: 'unknown' }),
  ]

  const events: AnimalEvent[] = [
    e({ id: 'ev1', animalId: 'demo-cow1', type: 'breeding', date: addDays(today, -270), title: 'Mated (AI)', method: 'ai', partnerTag: 'KB-001', expectedDue: addDays(today, 13), pregnancy: 'confirmed', professional: 'AI technician' }),
    e({ id: 'ev2', animalId: 'demo-cow1', type: 'vaccination', date: addDays(today, -170), title: 'Foot and mouth disease', nextDue: addDays(today, 10), professional: 'Sub-county vet' }),
    e({ id: 'ev3', animalId: 'demo-cow1', type: 'weight', date: addDays(today, -120), title: 'Weight', value: 520, unit: 'kg' }),
    e({ id: 'ev4', animalId: 'demo-cow1', type: 'weight', date: addDays(today, -60), title: 'Weight', value: 548, unit: 'kg' }),
    e({ id: 'ev5', animalId: 'demo-cow1', type: 'weight', date: addDays(today, -7), title: 'Weight', value: 575, unit: 'kg' }),
    e({ id: 'ev6', animalId: 'demo-cow1', type: 'production', date: addDays(today, -300), title: 'Milk, daily average', value: 18, unit: 'L' }),
    e({ id: 'ev7', animalId: 'demo-cow2', type: 'treatment', date: addDays(today, -3), title: 'Mastitis treatment', details: 'Left rear quarter, swollen and clotted milk', professional: 'Dr. Mwangi', withdrawalDays: 5, withdrawalFor: 'milk' }),
    e({ id: 'ev8', animalId: 'demo-cow2', type: 'illness', date: addDays(today, -4), title: 'Swollen udder, clots in milk', details: 'Noticed at evening milking' }),
    e({ id: 'ev9', animalId: 'demo-calf', type: 'note', date: addDays(today, -150), title: 'Born on farm', details: 'Heifer calf, unassisted. Colostrum within the first hours.' }),
    e({ id: 'ev10', animalId: 'demo-calf', type: 'weight', date: addDays(today, -90), title: 'Weight', value: 78, unit: 'kg' }),
    e({ id: 'ev11', animalId: 'demo-calf', type: 'weight', date: addDays(today, -14), title: 'Weight', value: 131, unit: 'kg' }),
    e({ id: 'ev12', animalId: 'demo-flock', type: 'vaccination', date: addDays(today, -110), title: 'Newcastle disease', nextDue: addDays(today, -20), professional: 'Animal health worker' }),
    e({ id: 'ev13', animalId: 'demo-flock', type: 'production', date: addDays(today, -2), title: 'Eggs collected', value: 28, unit: 'eggs' }),
    e({ id: 'ev14', animalId: 'demo-goat1', type: 'breeding', date: addDays(today, -140), title: 'Mated', method: 'natural', partnerTag: 'Neighbour buck', expectedDue: addDays(today, 10), pregnancy: 'unconfirmed' }),
  ]

  return { ...emptyDb(), animals, events, farm: { name: 'Mwangi family farm', county: 'Kiambu', lat: -1.17, lng: 36.83 }, prefs: { species: ['cattle', 'goat', 'chicken'], reminderDays: 14 } }
}
