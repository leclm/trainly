import { z } from 'zod'

export const exerciseFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Exercício é obrigatório.')
    .min(2, 'Exercício deve ter no mínimo 2 caracteres.'),
  primaryMuscleGroup: z.string().trim().min(1, 'Informe um grupo muscular.'),
  secondaryMuscleGroups: z.array(z.string().trim()).default([]),
  imageUrl: z
    .string()
    .trim()
    .min(1, 'Informe uma URL válida para a imagem.')
    .url('Informe uma URL válida para a imagem.'),
  videoUrl: z
    .string()
    .trim()
    .min(1, 'Informe uma URL válida para o vídeo.')
    .url('Informe uma URL válida para o vídeo.'),
  description: z.string().trim().optional(),
  equipment: z.string().trim().optional(),
})

export type ExerciseFormInput = z.infer<typeof exerciseFormSchema>
