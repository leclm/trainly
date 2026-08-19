import type {
  Exercise,
  SessionSet,
  Workout,
  WorkoutSession,
} from '../../types/domain'

const toSessionSet = (sessionExerciseId: string, set: Workout['exercises'][number]['sets'][number]): SessionSet => ({
  id: `${sessionExerciseId}:set:${set.order}`,
  sessionExerciseId,
  order: set.order,
  plannedReps: set.targetReps,
  plannedWeight: set.targetWeight,
  actualReps: null,
  actualWeight: null,
  durationSeconds: set.targetDurationSeconds,
  completedAt: null,
  status: 'PENDING',
})

export const createSessionFromWorkout = (
  params: {
    userId: string
    sessionId: string
    workout: Workout
    exercisesById: Record<string, Exercise>
    startedAt?: Date
  },
): WorkoutSession => {
  const { userId, sessionId, workout, exercisesById, startedAt = new Date() } = params

  return {
    id: sessionId,
    userId,
    workoutId: workout.id,
    workoutNameSnapshot: workout.name,
    startedAt: startedAt.toISOString(),
    finishedAt: null,
    durationSeconds: null,
    status: 'IN_PROGRESS',
    exercises: workout.exercises
      .slice()
      .sort((left, right) => left.order - right.order)
      .map((workoutExercise, index) => {
        const sessionExerciseId = `${sessionId}:exercise:${index + 1}`
        return {
          id: sessionExerciseId,
          sessionId,
          exerciseId: workoutExercise.exerciseId,
          exerciseNameSnapshot: exercisesById[workoutExercise.exerciseId]?.name ?? 'Unknown exercise',
          order: workoutExercise.order,
          status: 'PENDING',
          notes: workoutExercise.notes ?? null,
          sets: workoutExercise.sets.map((set) => toSessionSet(sessionExerciseId, set)),
        }
      }),
  }
}

export const registerCompletedSet = (
  set: SessionSet,
  actual: { reps: number | null; weight: number | null },
  completedAt: Date = new Date(),
): SessionSet => ({
  ...set,
  actualReps: actual.reps,
  actualWeight: actual.weight,
  completedAt: completedAt.toISOString(),
  status: 'COMPLETED',
})

export const calculateSetVolume = (set: Pick<SessionSet, 'actualWeight' | 'actualReps'>): number => {
  if (set.actualWeight == null || set.actualReps == null) {
    return 0
  }

  return set.actualWeight * set.actualReps
}
