import { describe, expect, it } from 'vitest'

import { createSessionFromWorkout, registerCompletedSet } from './service'
import { workoutSchema } from '../workouts/schemas'
import type { Workout } from '../../types/domain'

const buildWorkout = (): Workout => ({
  id: 'workout-a',
  userId: 'user-1',
  name: 'Treino A — Pernas',
  status: 'ACTIVE',
  exercises: [
    {
      id: 'we-1',
      workoutId: 'workout-a',
      exerciseId: 'ex-1',
      order: 1,
      restSeconds: 90,
      sets: [
        {
          id: 'set-1',
          workoutExerciseId: 'we-1',
          order: 1,
          type: 'REPS',
          targetReps: 10,
          targetWeight: 80,
          targetDistance: null,
          targetDurationSeconds: null,
        },
      ],
    },
  ],
})

describe('session service', () => {
  it('creates an immutable session snapshot', () => {
    const baseWorkout = buildWorkout()
    const session = createSessionFromWorkout({
      userId: 'user-1',
      sessionId: 'session-1',
      workout: baseWorkout,
      exercisesById: {
        'ex-1': {
          id: 'ex-1',
          userId: 'user-1',
          name: 'Agachamento',
          primaryMuscleGroup: 'Pernas',
          secondaryMuscleGroups: [],
          type: 'musculação',
          isSystemExercise: false,
        },
      },
      startedAt: new Date('2026-08-19T18:30:00.000Z'),
    })

    baseWorkout.name = 'Treino Alterado'
    baseWorkout.exercises[0].sets[0].targetWeight = 120

    expect(session.workoutNameSnapshot).toBe('Treino A — Pernas')
    expect(session.exercises[0].sets[0].plannedWeight).toBe(80)
  })

  it('keeps planned and actual set values separated', () => {
    const baseWorkout = buildWorkout()
    const session = createSessionFromWorkout({
      userId: 'user-1',
      sessionId: 'session-2',
      workout: baseWorkout,
      exercisesById: {
        'ex-1': {
          id: 'ex-1',
          userId: 'user-1',
          name: 'Agachamento',
          primaryMuscleGroup: 'Pernas',
          secondaryMuscleGroups: [],
          type: 'musculação',
          isSystemExercise: false,
        },
      },
    })

    const updatedSet = registerCompletedSet(session.exercises[0].sets[0], { reps: 8, weight: 77.5 })

    expect(updatedSet.plannedReps).toBe(10)
    expect(updatedSet.plannedWeight).toBe(80)
    expect(updatedSet.actualReps).toBe(8)
    expect(updatedSet.actualWeight).toBe(77.5)
  })
})

describe('workout validation', () => {
  it('requires workout name and unique exercise order', () => {
    const result = workoutSchema.safeParse({
      name: ' ',
      exercises: [
        {
          exerciseId: 'ex-1',
          order: 1,
          restSeconds: 60,
          sets: [
            {
              order: 1,
              targetReps: 10,
              targetWeight: 20,
              targetDistance: null,
              targetDurationSeconds: null,
            },
          ],
        },
        {
          exerciseId: 'ex-2',
          order: 1,
          restSeconds: 60,
          sets: [
            {
              order: 1,
              targetReps: 10,
              targetWeight: 20,
              targetDistance: null,
              targetDurationSeconds: null,
            },
          ],
        },
      ],
    })

    expect(result.success).toBe(false)

    if (result.success) {
      return
    }

    const messages = result.error.issues.map((issue) => issue.message)
    expect(messages).toContain('Workout name is required')
    expect(messages).toContain('Exercise order must be unique')
  })
})
