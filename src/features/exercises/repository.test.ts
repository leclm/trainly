import { beforeEach, describe, expect, it } from 'vitest'

import { LocalStorageExerciseRepository } from './repository'

const STORAGE_KEY = 'trainly.exercises.test.v1'

describe('LocalStorageExerciseRepository', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('creates and lists exercises', () => {
    const repository = new LocalStorageExerciseRepository(
      window.localStorage,
      () => '2026-08-19T18:37:00.000Z',
      STORAGE_KEY,
    )

    const createdExercise = repository.create({
      name: 'Supino reto',
      primaryMuscleGroup: 'Peitoral',
      secondaryMuscleGroups: ['Tríceps'],
      imageUrl: 'https://example.com/supino.png',
      videoUrl: 'https://www.youtube.com/watch?v=1x2x3x4x5x6',
    })

    const allExercises = repository.getAll()

    expect(allExercises.some((exercise) => exercise.name === 'Leg Press')).toBe(true)
    expect(allExercises.some((exercise) => exercise.id === createdExercise.id)).toBe(true)
  })

  it('gets exercise by id and updates it', () => {
    const repository = new LocalStorageExerciseRepository(
      window.localStorage,
      () => '2026-08-19T18:37:00.000Z',
      STORAGE_KEY,
    )

    const createdExercise = repository.create({
      name: 'Remada',
      primaryMuscleGroup: 'Costas',
      secondaryMuscleGroups: [],
      imageUrl: 'https://example.com/remada.png',
      videoUrl: 'https://youtu.be/abc123xyz00',
    })

    const foundExercise = repository.getById(createdExercise.id)

    expect(foundExercise?.name).toBe('Remada')

    const updatedExercise = repository.update(createdExercise.id, {
      name: 'Remada curvada',
      primaryMuscleGroup: 'Costas',
      secondaryMuscleGroups: ['Trapézio'],
      imageUrl: 'https://example.com/remada-curvada.png',
      videoUrl: 'https://www.youtube.com/shorts/N2hvV6tvZ2w',
    })

    expect(updatedExercise?.id).toBe(createdExercise.id)
    expect(updatedExercise?.name).toBe('Remada curvada')
    expect(updatedExercise?.updatedAt).toBe('2026-08-19T18:37:00.000Z')
  })

  it('archives exercise and hides it from default listing', () => {
    const repository = new LocalStorageExerciseRepository(
      window.localStorage,
      () => '2026-08-19T18:37:00.000Z',
      STORAGE_KEY,
    )

    const createdExercise = repository.create({
      name: 'Rosca direta',
      primaryMuscleGroup: 'Bíceps',
      secondaryMuscleGroups: ['Antebraço'],
      imageUrl: 'https://example.com/rosca.png',
      videoUrl: 'https://www.youtube.com/watch?v=abc123xyz00',
    })

    repository.archive(createdExercise.id)

    const visibleExercises = repository.getAll()
    const allExercises = repository.getAll({ includeArchived: true })

    expect(visibleExercises.some((exercise) => exercise.id === createdExercise.id)).toBe(false)
    expect(allExercises.find((exercise) => exercise.id === createdExercise.id)?.isArchived).toBe(true)
  })

  it('keeps seed unique on repeated initialization', () => {
    new LocalStorageExerciseRepository(window.localStorage, () => '2026-08-19T18:37:00.000Z', STORAGE_KEY)
    new LocalStorageExerciseRepository(window.localStorage, () => '2026-08-19T18:37:00.000Z', STORAGE_KEY)

    const repository = new LocalStorageExerciseRepository(
      window.localStorage,
      () => '2026-08-19T18:37:00.000Z',
      STORAGE_KEY,
    )

    const allExercises = repository.getAll({ includeArchived: true })
    const seedExercises = allExercises.filter((exercise) => exercise.name === 'Leg Press')

    expect(seedExercises).toHaveLength(1)
  })
})
