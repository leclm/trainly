export const MUSCLE_GROUPS = [
  'Abdômen',
  'Aeróbico',
  'Antebraço',
  'Bíceps',
  'Costas',
  'Glúteos',
  'Ombros',
  'Panturrilha',
  'Peitoral',
  'Pernas',
  'Posteriores de coxa',
  'Quadríceps',
  'Trapézio',
  'Tríceps',
  'Outros',
] as const

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number]

export const ALL_MUSCLE_GROUPS_FILTER = 'TODOS'
