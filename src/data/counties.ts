export interface County {
  name: string
  lat: number
  lng: number
}

/** Approximate coordinates of each county's main town. Used only to fetch a general forecast. */
export const COUNTIES: County[] = [
  { name: 'Baringo', lat: 0.49, lng: 35.74 },
  { name: 'Bomet', lat: -0.78, lng: 35.34 },
  { name: 'Bungoma', lat: 0.57, lng: 34.56 },
  { name: 'Busia', lat: 0.46, lng: 34.11 },
  { name: 'Elgeyo-Marakwet', lat: 0.67, lng: 35.51 },
  { name: 'Embu', lat: -0.53, lng: 37.45 },
  { name: 'Garissa', lat: -0.45, lng: 39.65 },
  { name: 'Homa Bay', lat: -0.53, lng: 34.46 },
  { name: 'Isiolo', lat: 0.35, lng: 37.58 },
  { name: 'Kajiado', lat: -1.85, lng: 36.78 },
  { name: 'Kakamega', lat: 0.28, lng: 34.75 },
  { name: 'Kericho', lat: -0.37, lng: 35.28 },
  { name: 'Kiambu', lat: -1.17, lng: 36.83 },
  { name: 'Kilifi', lat: -3.63, lng: 39.85 },
  { name: 'Kirinyaga', lat: -0.5, lng: 37.28 },
  { name: 'Kisii', lat: -0.68, lng: 34.77 },
  { name: 'Kisumu', lat: -0.09, lng: 34.77 },
  { name: 'Kitui', lat: -1.37, lng: 38.01 },
  { name: 'Kwale', lat: -4.17, lng: 39.45 },
  { name: 'Laikipia', lat: 0.01, lng: 37.07 },
  { name: 'Lamu', lat: -2.27, lng: 40.9 },
  { name: 'Machakos', lat: -1.52, lng: 37.26 },
  { name: 'Makueni', lat: -1.78, lng: 37.63 },
  { name: 'Mandera', lat: 3.94, lng: 41.86 },
  { name: 'Marsabit', lat: 2.33, lng: 37.99 },
  { name: 'Meru', lat: 0.05, lng: 37.65 },
  { name: 'Migori', lat: -1.06, lng: 34.47 },
  { name: 'Mombasa', lat: -4.04, lng: 39.67 },
  { name: "Murang'a", lat: -0.72, lng: 37.15 },
  { name: 'Nairobi', lat: -1.29, lng: 36.82 },
  { name: 'Nakuru', lat: -0.3, lng: 36.08 },
  { name: 'Nandi', lat: 0.2, lng: 35.1 },
  { name: 'Narok', lat: -1.08, lng: 35.87 },
  { name: 'Nyamira', lat: -0.57, lng: 34.95 },
  { name: 'Nyandarua', lat: -0.27, lng: 36.38 },
  { name: 'Nyeri', lat: -0.42, lng: 36.95 },
  { name: 'Samburu', lat: 1.1, lng: 36.7 },
  { name: 'Siaya', lat: 0.06, lng: 34.29 },
  { name: 'Taita-Taveta', lat: -3.4, lng: 38.56 },
  { name: 'Tana River', lat: -1.5, lng: 40.03 },
  { name: 'Tharaka-Nithi', lat: -0.33, lng: 37.65 },
  { name: 'Trans Nzoia', lat: 1.02, lng: 35.0 },
  { name: 'Turkana', lat: 3.12, lng: 35.6 },
  { name: 'Uasin Gishu', lat: 0.52, lng: 35.27 },
  { name: 'Vihiga', lat: 0.08, lng: 34.72 },
  { name: 'Wajir', lat: 1.75, lng: 40.06 },
  { name: 'West Pokot', lat: 1.24, lng: 35.11 },
]

/** Finds a Kenyan county by name without regard to letter case or extra spaces. */
export function findCounty(name: string): County | undefined {
  return COUNTIES.find((c) => c.name === name)
}
