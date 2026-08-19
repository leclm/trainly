import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import {
  ALL_MUSCLE_GROUPS_FILTER,
  MUSCLE_GROUPS,
} from '../../features/exercises/muscleGroups'
import { filterExercises } from '../../features/exercises/search'
import { exerciseService } from '../../features/exercises/service'
import type { StoredExercise } from '../../features/exercises/repository'

interface LocationState {
  feedback?: string
}

export const ExercisesListPage = () => {
  const [exercises, setExercises] = useState<StoredExercise[]>(() => exerciseService.getAll())
  const [searchTerm, setSearchTerm] = useState('')
  const [muscleGroupFilter, setMuscleGroupFilter] = useState(ALL_MUSCLE_GROUPS_FILTER)

  const location = useLocation()
  const navigate = useNavigate()

  const feedback = (location.state as LocationState | null)?.feedback

  const filteredExercises = useMemo(
    () => filterExercises(exercises, searchTerm, muscleGroupFilter),
    [exercises, muscleGroupFilter, searchTerm],
  )

  const handleArchive = (exerciseId: string) => {
    const archivedExercise = exerciseService.archive(exerciseId)

    if (archivedExercise == null) {
      return
    }

    setExercises(exerciseService.getAll())
    navigate(location.pathname, {
      replace: true,
      state: { feedback: 'Exercício arquivado com sucesso.' },
    })
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h2>Exercícios</h2>
          <p>Gerencie os exercícios disponíveis para seus treinos.</p>
        </div>
        <Link className="button button-primary" to="/exercises/new">
          + Novo exercício
        </Link>
      </header>

      {feedback != null ? (
        <p className="feedback-success" role="status">
          {feedback}
        </p>
      ) : null}

      <div className="exercise-filters" role="search">
        <div className="field-stack">
          <label htmlFor="exercise-search">Buscar exercício...</label>
          <input
            id="exercise-search"
            name="exercise-search"
            placeholder="Buscar exercício..."
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
          />
        </div>

        <div className="field-stack">
          <label htmlFor="exercise-muscle-group-filter">Todos os grupos musculares</label>
          <select
            id="exercise-muscle-group-filter"
            name="exercise-muscle-group-filter"
            value={muscleGroupFilter}
            onChange={(event) => setMuscleGroupFilter(event.currentTarget.value)}
          >
            <option value={ALL_MUSCLE_GROUPS_FILTER}>Todos</option>
            {MUSCLE_GROUPS.map((muscleGroup) => (
              <option key={muscleGroup} value={muscleGroup}>
                {muscleGroup}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredExercises.length === 0 ? (
        <section className="empty-state" aria-live="polite">
          <p>Você ainda não cadastrou nenhum exercício.</p>
          <Link className="button button-primary" to="/exercises/new">
            Cadastrar primeiro exercício
          </Link>
        </section>
      ) : (
        <div className="exercise-grid">
          {filteredExercises.map((exercise) => (
            <article className="exercise-card" key={exercise.id}>
              <img src={exercise.imageUrl} alt={`Imagem do exercício ${exercise.name}`} loading="lazy" />
              <div className="exercise-card-content">
                <h3>{exercise.name}</h3>
                <p>
                  <strong>Grupo principal:</strong> {exercise.primaryMuscleGroup}
                </p>
                {exercise.secondaryMuscleGroups.length > 0 ? (
                  <p>
                    <strong>Secundários:</strong> {exercise.secondaryMuscleGroups.join(', ')}
                  </p>
                ) : null}
                <div className="exercise-card-actions">
                  <Link className="button" to={`/exercises/${exercise.id}`}>
                    Visualizar
                  </Link>
                  <Link className="button" to={`/exercises/${exercise.id}/edit`}>
                    Editar
                  </Link>
                  <button
                    className="button button-danger"
                    type="button"
                    onClick={() => handleArchive(exercise.id)}
                  >
                    Arquivar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
