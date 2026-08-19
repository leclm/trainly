export type WorkoutStatus = 'ACTIVE' | 'ARCHIVED'
export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED'
export type SessionExerciseStatus = 'PENDING' | 'COMPLETED' | 'SKIPPED'

export type WorkoutSetType =
  | 'REPS'
  | 'TIME'
  | 'DISTANCE'
  | 'ISOMETRIC'
  | 'MAX'
  | 'VARIABLE_REPS'

export interface Exercise {
  id: string
  userId: string | null
  name: string
  description?: string | null
  primaryMuscleGroup: string
  secondaryMuscleGroups: string[]
  equipment?: string | null
  type: string
  instructions?: string | null
  imageUrl?: string | null
  videoUrl?: string | null
  isSystemExercise: boolean
}

export interface Workout {
  id: string
  userId: string
  name: string
  description?: string | null
  color?: string | null
  status: WorkoutStatus
  exercises: WorkoutExercise[]
}

export interface WorkoutExercise {
  id: string
  workoutId: string
  exerciseId: string
  order: number
  restSeconds: number
  notes?: string | null
  sets: WorkoutSet[]
}

export interface WorkoutSet {
  id: string
  workoutExerciseId: string
  order: number
  type: WorkoutSetType
  targetReps: number | null
  targetDurationSeconds: number | null
  targetWeight: number | null
  targetDistance: number | null
}

export interface WorkoutSession {
  id: string
  userId: string
  workoutId: string
  workoutNameSnapshot: string
  startedAt: string
  finishedAt: string | null
  durationSeconds: number | null
  status: SessionStatus
  exercises: SessionExercise[]
}

export interface SessionExercise {
  id: string
  sessionId: string
  exerciseId: string
  exerciseNameSnapshot: string
  order: number
  status: SessionExerciseStatus
  notes: string | null
  sets: SessionSet[]
}

export interface SessionSet {
  id: string
  sessionExerciseId: string
  order: number
  plannedReps: number | null
  plannedWeight: number | null
  actualReps: number | null
  actualWeight: number | null
  durationSeconds: number | null
  completedAt: string | null
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED'
}
