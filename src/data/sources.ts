export interface SourceOrg {
  id: string
  name: string
  short: string
  url: string
  covers: string
}

export const SOURCES: SourceOrg[] = [
  { id: 'kalro', short: 'KALRO', name: 'Kenya Agricultural and Livestock Research Organization', url: 'https://www.kalro.org/', covers: 'Local agricultural research, livestock management and farming practices.' },
  { id: 'kmd', short: 'KMD', name: 'Kenya Meteorological Department', url: 'https://meteo.go.ke/', covers: 'Official weather, rainfall and agricultural climate information.' },
  { id: 'fao', short: 'FAO', name: 'Food and Agriculture Organization of the United Nations', url: 'https://www.fao.org/', covers: 'Sustainable livestock production, animal nutrition and agricultural development.' },
  { id: 'woah', short: 'WOAH', name: 'World Organisation for Animal Health', url: 'https://www.woah.org/', covers: 'Animal health, disease prevention and animal welfare guidance.' },
  { id: 'vet', short: 'Kenyan veterinary authorities', name: 'Directorate of Veterinary Services and qualified veterinary professionals', url: '', covers: 'Locally applicable disease control, vaccination and treatment guidance.' },
]

export const CONTENT_STATUS = {
  version: 'Draft 0.1',
  reviewed: false,
  label: 'Draft. Not yet reviewed by a qualified veterinarian or animal nutritionist.',
  short: 'Pending expert review',
}
