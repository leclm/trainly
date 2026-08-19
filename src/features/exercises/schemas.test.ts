import { describe, expect, it } from 'vitest'

import { exerciseFormSchema } from './schemas'

const validExerciseInput = {
  name: 'Leg Press',
  primaryMuscleGroup: 'Quadríceps',
  secondaryMuscleGroups: ['Glúteos'],
  imageUrl: 'https://example.com/image.png',
  videoUrl: 'https://www.youtube.com/watch?v=abc123xyz00',
}

describe('exerciseFormSchema', () => {
  it('rejects empty name', () => {
    const result = exerciseFormSchema.safeParse({ ...validExerciseInput, name: '' })
    expect(result.success).toBe(false)
  })

  it('accepts valid name', () => {
    const result = exerciseFormSchema.safeParse(validExerciseInput)
    expect(result.success).toBe(true)
  })

  it('rejects empty primary muscle group', () => {
    const result = exerciseFormSchema.safeParse({ ...validExerciseInput, primaryMuscleGroup: '' })
    expect(result.success).toBe(false)

    if (result.success) {
      return
    }

    expect(result.error.issues[0]?.message).toBe('Informe um grupo muscular.')
  })

  it('rejects invalid image url', () => {
    const result = exerciseFormSchema.safeParse({ ...validExerciseInput, imageUrl: 'imagem-invalida' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid video url', () => {
    const result = exerciseFormSchema.safeParse({ ...validExerciseInput, videoUrl: 'video-invalido' })
    expect(result.success).toBe(false)
  })
})
