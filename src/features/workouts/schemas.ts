import { z } from 'zod'

export const workoutSetSchema = z.object({
  order: z.number().int().nonnegative(),
  targetReps: z.number().nonnegative().nullable(),
  targetDurationSeconds: z.number().nonnegative().nullable(),
  targetWeight: z.number().nonnegative().nullable(),
  targetDistance: z.number().nonnegative().nullable(),
})

export const workoutExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  order: z.number().int().nonnegative(),
  restSeconds: z.number().int().nonnegative(),
  sets: z.array(workoutSetSchema).min(1),
})

export const workoutSchema = z.object({
  name: z.string().trim().min(1, 'Workout name is required'),
  description: z.string().trim().optional(),
  exercises: z
    .array(workoutExerciseSchema)
    .min(1, 'At least one exercise is required to start workout')
    .refine((exercises) => {
      const seen = new Set<number>()
      for (const exercise of exercises) {
        if (seen.has(exercise.order)) {
          return false
        }
        seen.add(exercise.order)
      }
      return true
    }, 'Exercise order must be unique'),
})

export type WorkoutInput = z.infer<typeof workoutSchema>
