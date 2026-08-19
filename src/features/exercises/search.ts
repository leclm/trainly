import type { Exercise } from '../../types/domain'

import { ALL_MUSCLE_GROUPS_FILTER } from './muscleGroups'

export const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

export const filterExercises = <T extends Exercise>(
  exercises: T[],
  searchTerm: string,
  primaryMuscleGroup: string,
): T[] => {
  const normalizedSearchTerm = normalizeText(searchTerm)

  return exercises.filter((exercise) => {
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      normalizeText(exercise.name).includes(normalizedSearchTerm)

    const matchesPrimaryMuscleGroup =
      primaryMuscleGroup === ALL_MUSCLE_GROUPS_FILTER ||
      exercise.primaryMuscleGroup === primaryMuscleGroup

    return matchesSearch && matchesPrimaryMuscleGroup
  })
}
