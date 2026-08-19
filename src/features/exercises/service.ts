import {
  createExerciseRepository,
  type ExerciseRepository,
  type ExerciseWriteInput,
  type StoredExercise,
} from './repository'

export interface ExerciseService {
  getAll(): StoredExercise[]
  getById(id: string): StoredExercise | null
  create(input: ExerciseWriteInput): StoredExercise
  update(id: string, input: ExerciseWriteInput): StoredExercise | null
  archive(id: string): StoredExercise | null
  delete(id: string): boolean
}

export const createExerciseService = (repository: ExerciseRepository): ExerciseService => ({
  getAll: () => repository.getAll(),
  getById: (id) => repository.getById(id),
  create: (input) => repository.create(input),
  update: (id, input) => repository.update(id, input),
  archive: (id) => repository.archive(id),
  delete: (id) => repository.delete(id),
})

export const exerciseService = createExerciseService(createExerciseRepository())
