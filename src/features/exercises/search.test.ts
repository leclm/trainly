import { describe, expect, it } from 'vitest'

import type { Exercise } from '../../types/domain'

import { ALL_MUSCLE_GROUPS_FILTER } from './muscleGroups'
import { filterExercises } from './search'

const exercises: Exercise[] = [
  {
    id: '1',
    userId: null,
    name: 'Leg Press',
    primaryMuscleGroup: 'Quadríceps',
    secondaryMuscleGroups: ['Glúteos'],
    type: 'MUSCULAÇÃO',
    imageUrl: 'https://example.com/legpress.png',
    videoUrl: 'https://youtu.be/abc123xyz00',
    isSystemExercise: false,
  },
  {
    id: '2',
    userId: null,
    name: 'Agachamento com barra',
    primaryMuscleGroup: 'Quadríceps',
    secondaryMuscleGroups: [],
    type: 'MUSCULAÇÃO',
    imageUrl: 'https://example.com/agachamento.png',
    videoUrl: 'https://youtu.be/abc123xyz00',
    isSystemExercise: false,
  },
  {
    id: '3',
    userId: null,
    name: 'Elevação pélvica',
    primaryMuscleGroup: 'Glúteos',
    secondaryMuscleGroups: [],
    type: 'MUSCULAÇÃO',
    imageUrl: 'https://example.com/elevacao.png',
    videoUrl: 'https://youtu.be/abc123xyz00',
    isSystemExercise: false,
  },
]

describe('filterExercises', () => {
  it('finds exercise by name', () => {
    const result = filterExercises(exercises, 'leg', ALL_MUSCLE_GROUPS_FILTER)
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('Leg Press')
  })

  it('applies case-insensitive search', () => {
    const result = filterExercises(exercises, 'AGACHAMENTO', ALL_MUSCLE_GROUPS_FILTER)
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('Agachamento com barra')
  })

  it('ignores accent differences in search', () => {
    const result = filterExercises(exercises, 'elevacao', ALL_MUSCLE_GROUPS_FILTER)
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('Elevação pélvica')
  })

  it('filters by muscle group', () => {
    const result = filterExercises(exercises, '', 'Glúteos')
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('Elevação pélvica')
  })

  it('combines search and muscle group filter', () => {
    const result = filterExercises(exercises, 'agacha', 'Quadríceps')
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('Agachamento com barra')
  })
})
