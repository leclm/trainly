import { type FormEvent, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { MUSCLE_GROUPS } from '../../features/exercises/muscleGroups'
import { exerciseFormSchema, type ExerciseFormInput } from '../../features/exercises/schemas'
import { exerciseService } from '../../features/exercises/service'
import { isYoutubeUrl } from '../../features/exercises/youtube'

const DEFAULT_FORM: ExerciseFormInput = {
  name: '',
  primaryMuscleGroup: '',
  secondaryMuscleGroups: [],
  imageUrl: '',
  videoUrl: '',
  description: '',
  equipment: '',
}

const toFormValues = (exerciseId: string | undefined): ExerciseFormInput => {
  if (exerciseId == null) {
    return DEFAULT_FORM
  }

  const exercise = exerciseService.getById(exerciseId)
  if (exercise == null) {
    return DEFAULT_FORM
  }

  return {
    name: exercise.name,
    primaryMuscleGroup: exercise.primaryMuscleGroup,
    secondaryMuscleGroups: exercise.secondaryMuscleGroups,
    imageUrl: exercise.imageUrl,
    videoUrl: exercise.videoUrl,
    description: exercise.description ?? '',
    equipment: exercise.equipment ?? '',
  }
}

export const ExerciseFormPage = () => {
  const { exerciseId } = useParams()
  const navigate = useNavigate()

  const isEditing = exerciseId != null
  const existingExercise = isEditing && exerciseId != null ? exerciseService.getById(exerciseId) : null

  const [formValues, setFormValues] = useState<ExerciseFormInput>(() => toFormValues(exerciseId))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ExerciseFormInput, string>>>({})
  const [imageLoadError, setImageLoadError] = useState(false)

  const availableSecondaryGroups = useMemo(
    () => MUSCLE_GROUPS.filter((muscleGroup) => muscleGroup !== formValues.primaryMuscleGroup),
    [formValues.primaryMuscleGroup],
  )

  if (isEditing && existingExercise == null) {
    return <Navigate replace to="/exercises" />
  }

  const updateField = <K extends keyof ExerciseFormInput>(fieldName: K, fieldValue: ExerciseFormInput[K]) => {
    setFormValues((currentValues) => ({ ...currentValues, [fieldName]: fieldValue }))
    setFieldErrors((currentErrors) => ({ ...currentErrors, [fieldName]: undefined }))
  }

  const toggleSecondaryGroup = (secondaryGroup: string) => {
    setFormValues((currentValues) => {
      const isSelected = currentValues.secondaryMuscleGroups.includes(secondaryGroup)
      const nextSecondaryGroups = isSelected
        ? currentValues.secondaryMuscleGroups.filter((group) => group !== secondaryGroup)
        : [...currentValues.secondaryMuscleGroups, secondaryGroup]

      return {
        ...currentValues,
        secondaryMuscleGroups: nextSecondaryGroups,
      }
    })
  }

  const handlePrimaryGroupChange = (value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      primaryMuscleGroup: value,
      secondaryMuscleGroups: currentValues.secondaryMuscleGroups.filter((group) => group !== value),
    }))
    setFieldErrors((currentErrors) => ({ ...currentErrors, primaryMuscleGroup: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsedForm = exerciseFormSchema.safeParse(formValues)

    if (!parsedForm.success) {
      const nextErrors: Partial<Record<keyof ExerciseFormInput, string>> = {}
      for (const issue of parsedForm.error.issues) {
        const fieldName = issue.path[0]
        if (typeof fieldName === 'string' && nextErrors[fieldName as keyof ExerciseFormInput] == null) {
          nextErrors[fieldName as keyof ExerciseFormInput] = issue.message
        }
      }
      setFieldErrors(nextErrors)
      return
    }

    setIsSubmitting(true)

    if (isEditing && exerciseId != null) {
      exerciseService.update(exerciseId, parsedForm.data)
      navigate('/exercises', {
        state: { feedback: 'Exercício atualizado com sucesso.' },
      })
      return
    }

    exerciseService.create(parsedForm.data)
    navigate('/exercises', {
      state: { feedback: 'Exercício cadastrado com sucesso.' },
    })
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h2>{isEditing ? 'Editar exercício' : 'Novo exercício'}</h2>
          <p>Preencha os dados para salvar o exercício na sua biblioteca.</p>
        </div>
      </header>

      <form className="form-stack" noValidate onSubmit={handleSubmit}>
        <div className="field-stack">
          <label htmlFor="exercise-name">Exercício</label>
          <input
            id="exercise-name"
            name="exercise-name"
            placeholder="Ex.: Leg Press"
            value={formValues.name}
            onChange={(event) => updateField('name', event.currentTarget.value)}
            aria-invalid={fieldErrors.name != null}
            aria-describedby={fieldErrors.name != null ? 'exercise-name-error' : undefined}
          />
          {fieldErrors.name != null ? (
            <p className="field-error" id="exercise-name-error" role="alert">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div className="field-stack">
          <label htmlFor="exercise-primary-group">Grupo muscular principal</label>
          <select
            id="exercise-primary-group"
            name="exercise-primary-group"
            value={formValues.primaryMuscleGroup}
            onChange={(event) => handlePrimaryGroupChange(event.currentTarget.value)}
            aria-invalid={fieldErrors.primaryMuscleGroup != null}
            aria-describedby={
              fieldErrors.primaryMuscleGroup != null ? 'exercise-primary-group-error' : undefined
            }
          >
            <option value="">Selecione um grupo muscular</option>
            {MUSCLE_GROUPS.map((muscleGroup) => (
              <option key={muscleGroup} value={muscleGroup}>
                {muscleGroup}
              </option>
            ))}
          </select>
          {fieldErrors.primaryMuscleGroup != null ? (
            <p className="field-error" id="exercise-primary-group-error" role="alert">
              {fieldErrors.primaryMuscleGroup}
            </p>
          ) : null}
        </div>

        <fieldset className="field-stack">
          <legend>Grupos musculares secundários</legend>
          <div className="checkbox-grid">
            {availableSecondaryGroups.map((muscleGroup) => (
              <label key={muscleGroup} className="checkbox-item">
                <input
                  checked={formValues.secondaryMuscleGroups.includes(muscleGroup)}
                  type="checkbox"
                  value={muscleGroup}
                  onChange={() => toggleSecondaryGroup(muscleGroup)}
                />
                <span>{muscleGroup}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field-stack">
          <label htmlFor="exercise-image-url">Imagem do exercício</label>
          <input
            id="exercise-image-url"
            name="exercise-image-url"
            placeholder="Cole a URL da imagem"
            value={formValues.imageUrl}
            onChange={(event) => {
              updateField('imageUrl', event.currentTarget.value)
              setImageLoadError(false)
            }}
            aria-invalid={fieldErrors.imageUrl != null}
            aria-describedby={fieldErrors.imageUrl != null ? 'exercise-image-url-error' : undefined}
          />
          {fieldErrors.imageUrl != null ? (
            <p className="field-error" id="exercise-image-url-error" role="alert">
              {fieldErrors.imageUrl}
            </p>
          ) : null}
          {formValues.imageUrl.length > 0 ? (
            imageLoadError ? (
              <p className="field-hint" role="status">
                Não foi possível carregar a imagem com essa URL.
              </p>
            ) : (
              <img
                className="image-preview"
                src={formValues.imageUrl}
                alt="Pré-visualização da imagem do exercício"
                onError={() => setImageLoadError(true)}
              />
            )
          ) : null}
        </div>

        <div className="field-stack">
          <label htmlFor="exercise-video-url">Vídeo do exercício</label>
          <input
            id="exercise-video-url"
            name="exercise-video-url"
            placeholder="Cole a URL do vídeo"
            value={formValues.videoUrl}
            onChange={(event) => updateField('videoUrl', event.currentTarget.value)}
            aria-invalid={fieldErrors.videoUrl != null}
            aria-describedby={fieldErrors.videoUrl != null ? 'exercise-video-url-error' : undefined}
          />
          {fieldErrors.videoUrl != null ? (
            <p className="field-error" id="exercise-video-url-error" role="alert">
              {fieldErrors.videoUrl}
            </p>
          ) : null}
          {isYoutubeUrl(formValues.videoUrl) ? (
            <a href={formValues.videoUrl} rel="noreferrer" target="_blank">
              Ver vídeo
            </a>
          ) : null}
        </div>

        <div className="field-stack">
          <label htmlFor="exercise-description">Descrição</label>
          <textarea
            id="exercise-description"
            name="exercise-description"
            rows={3}
            value={formValues.description}
            onChange={(event) => updateField('description', event.currentTarget.value)}
          />
        </div>

        <div className="field-stack">
          <label htmlFor="exercise-equipment">Equipamento</label>
          <input
            id="exercise-equipment"
            name="exercise-equipment"
            value={formValues.equipment}
            onChange={(event) => updateField('equipment', event.currentTarget.value)}
          />
        </div>

        <div className="form-actions">
          <Link className="button" to="/exercises">
            Cancelar
          </Link>
          <button className="button button-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Salvar exercício'}
          </button>
        </div>
      </form>
    </section>
  )
}
