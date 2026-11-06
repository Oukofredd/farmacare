export type SpeciesId = 'cattle' | 'goat' | 'sheep' | 'pig' | 'chicken'| 'duck' | 'turkey' | 'rabbit' | 'bee' | 'other'
export type Sex = 'female' | 'male' | 'unknown'
export type SourceType = 'born_on_farm' | 'purchased' | 'gift' | 'unknown'
export type GeneticStatus =
  | 'unknown'
  | 'purebred_documented'
  | 'purebred_claimed'
  | 'crossbred'
  | 'commercial_hybrid'
  | 'grade_upgraded'
export type AnimalStatus = 'active' | 'sold' | 'deceased'

export interface Animal {
  id: string
  tag: string
  name?: string
  species: SpeciesId
  /** a breed id from data/breeds, or 'mixed' | 'unknown' */
  breedId: string
  sex: Sex
  /** 1 for an individual; more for a flock or litter group */
  count: number
  dob?: string
  dobEstimated: boolean
  source: SourceType
  sourceDetail?: string
  sireTag?: string
  damTag?: string
  pedigreeVerified: boolean
  geneticStatus: GeneticStatus
  status: AnimalStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export type EventType =
  | 'vaccination'
  | 'treatment'
  | 'illness'
  | 'breeding'
  | 'birth'
  | 'weight'
  | 'production'
  | 'transfer'
  | 'note'

export type PregnancyState = 'unconfirmed' | 'confirmed' | 'not_pregnant'
export type WithdrawalFor = 'milk' | 'meat' | 'eggs' | 'milk_and_meat'

export interface AnimalEvent {
  id: string
  animalId: string
  type: EventType
  date: string
  title: string
  details?: string
  /** name of vet / animal health worker; empty means farmer observation */
  professional?: string
  value?: number
  unit?: string
  nextDue?: string
  withdrawalDays?: number
  withdrawalFor?: WithdrawalFor
  partnerTag?: string
  method?: 'natural' | 'ai' | 'unknown'
  expectedDue?: string
  pregnancy?: PregnancyState
  /** for birth events: the breeding event this birth closes */
  linkedId?: string
  createdAt: string
}

export interface Farm {
  name: string
  county: string
  lat?: number
  lng?: number
  /** true when the coordinates came from the device GPS */
  gps?: boolean
}

export interface Prefs {
  species: SpeciesId[]
  reminderDays: number
}

export interface Db {
  version: 1
  animals: Animal[]
  events: AnimalEvent[]
  farm: Farm
  prefs: Prefs
  bookmarks: string[]
}
