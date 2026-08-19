import type { Exercise } from '../../types/domain'

export interface StoredExercise extends Exercise {
  createdAt: string
  updatedAt: string
  isArchived: boolean
  imageUrl: string
  videoUrl: string
}

export interface ExerciseWriteInput {
  name: string
  primaryMuscleGroup: string
  secondaryMuscleGroups: string[]
  imageUrl: string
  videoUrl: string
  description?: string | null
  equipment?: string | null
}

export interface ExerciseRepository {
  getAll(params?: { includeArchived?: boolean }): StoredExercise[]
  getById(id: string): StoredExercise | null
  create(input: ExerciseWriteInput): StoredExercise
  update(id: string, input: ExerciseWriteInput): StoredExercise | null
  archive(id: string): StoredExercise | null
  delete(id: string): boolean
}

const STORAGE_KEY = 'trainly.exercises.v1'
const SEED_EXERCISE_ID = 'exercise-leg-press'

const getNowIso = (): string => new Date().toISOString()

const createSeedExercise = (nowIso: string): StoredExercise => ({
  id: SEED_EXERCISE_ID,
  userId: null,
  name: 'Leg Press',
  primaryMuscleGroup: 'Quadríceps',
  secondaryMuscleGroups: ['Glúteos', 'Posteriores de coxa'],
  imageUrl: 'https://image.tuasaude.com/media/article/nb/le/leg-press_75589.gif?width=686&height=487',
  videoUrl: 'https://www.youtube.com/shorts/N2hvV6tvZ2w',
  description: null,
  equipment: null,
  type: 'MUSCULAÇÃO',
  instructions: null,
  isSystemExercise: true,
  createdAt: nowIso,
  updatedAt: nowIso,
  isArchived: false,
})

const createExerciseId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `exercise-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export class LocalStorageExerciseRepository implements ExerciseRepository {
  private readonly storage: Storage

  private readonly nowProvider: () => string

  private readonly storageKey: string

  constructor(storage: Storage = window.localStorage, nowProvider: () => string = getNowIso, storageKey: string = STORAGE_KEY) {
    this.storage = storage
    this.nowProvider = nowProvider
    this.storageKey = storageKey
    this.ensureSeed()
  }

  getAll(params?: { includeArchived?: boolean }): StoredExercise[] {
    const includeArchived = params?.includeArchived ?? false
    return this.read()
      .filter((exercise) => includeArchived || !exercise.isArchived)
      .sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'))
  }

  getById(id: string): StoredExercise | null {
    return this.read().find((exercise) => exercise.id === id) ?? null
  }

  create(input: ExerciseWriteInput): StoredExercise {
    const nowIso = this.nowProvider()
    const exercise: StoredExercise = {
      id: createExerciseId(),
      userId: null,
      name: input.name,
      primaryMuscleGroup: input.primaryMuscleGroup,
      secondaryMuscleGroups: input.secondaryMuscleGroups,
      imageUrl: input.imageUrl,
      videoUrl: input.videoUrl,
      description: input.description ?? null,
      equipment: input.equipment ?? null,
      type: 'MUSCULAÇÃO',
      instructions: null,
      isSystemExercise: false,
      createdAt: nowIso,
      updatedAt: nowIso,
      isArchived: false,
    }

    const currentExercises = this.read()
    currentExercises.push(exercise)
    this.write(currentExercises)

    return exercise
  }

  update(id: string, input: ExerciseWriteInput): StoredExercise | null {
    const currentExercises = this.read()
    const exerciseIndex = currentExercises.findIndex((exercise) => exercise.id === id)

    if (exerciseIndex < 0) {
      return null
    }

    const currentExercise = currentExercises[exerciseIndex]
    const updatedExercise: StoredExercise = {
      ...currentExercise,
      name: input.name,
      primaryMuscleGroup: input.primaryMuscleGroup,
      secondaryMuscleGroups: input.secondaryMuscleGroups,
      imageUrl: input.imageUrl,
      videoUrl: input.videoUrl,
      description: input.description ?? null,
      equipment: input.equipment ?? null,
      updatedAt: this.nowProvider(),
    }

    currentExercises[exerciseIndex] = updatedExercise
    this.write(currentExercises)

    return updatedExercise
  }

  archive(id: string): StoredExercise | null {
    const currentExercises = this.read()
    const exerciseIndex = currentExercises.findIndex((exercise) => exercise.id === id)

    if (exerciseIndex < 0) {
      return null
    }

    const archivedExercise: StoredExercise = {
      ...currentExercises[exerciseIndex],
      isArchived: true,
      updatedAt: this.nowProvider(),
    }

    currentExercises[exerciseIndex] = archivedExercise
    this.write(currentExercises)

    return archivedExercise
  }

  delete(id: string): boolean {
    const currentExercises = this.read()
    const filteredExercises = currentExercises.filter((exercise) => exercise.id !== id)

    if (filteredExercises.length === currentExercises.length) {
      return false
    }

    this.write(filteredExercises)
    return true
  }

  private read(): StoredExercise[] {
    const rawValue = this.storage.getItem(this.storageKey)

    if (rawValue == null || rawValue.trim().length === 0) {
      return []
    }

    try {
      const parsedValue = JSON.parse(rawValue) as unknown
      if (!Array.isArray(parsedValue)) {
        return []
      }

      return parsedValue.filter(isStoredExercise)
    } catch {
      return []
    }
  }

  private write(exercises: StoredExercise[]): void {
    this.storage.setItem(this.storageKey, JSON.stringify(exercises))
  }

  private ensureSeed(): void {
    const exercises = this.read()
    const alreadySeeded = exercises.some((exercise) => exercise.id === SEED_EXERCISE_ID)

    if (alreadySeeded) {
      return
    }

    exercises.push(createSeedExercise(this.nowProvider()))
    this.write(exercises)
  }
}

const isStoredExercise = (value: unknown): value is StoredExercise => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<StoredExercise>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.primaryMuscleGroup === 'string' &&
    Array.isArray(candidate.secondaryMuscleGroups) &&
    typeof candidate.imageUrl === 'string' &&
    typeof candidate.videoUrl === 'string' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string' &&
    typeof candidate.isArchived === 'boolean'
  )
}

export const createExerciseRepository = (): ExerciseRepository => new LocalStorageExerciseRepository()
