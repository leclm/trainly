import { Link, useNavigate, useParams } from 'react-router-dom'

import { exerciseService } from '../../features/exercises/service'
import { getYoutubeEmbedUrl } from '../../features/exercises/youtube'

export const ExerciseDetailsPage = () => {
  const { exerciseId } = useParams()
  const navigate = useNavigate()

  if (exerciseId == null) {
    return null
  }

  const exercise = exerciseService.getById(exerciseId)

  if (exercise == null || exercise.isArchived) {
    return (
      <section className="page-stack">
        <h2>Exercício não encontrado</h2>
        <p>Esse exercício não está mais disponível na biblioteca.</p>
        <button className="button" type="button" onClick={() => navigate('/exercises')}>
          Voltar
        </button>
      </section>
    )
  }

  const embedUrl = getYoutubeEmbedUrl(exercise.videoUrl)

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h2>{exercise.name}</h2>
          <p>
            <strong>Grupo principal:</strong> {exercise.primaryMuscleGroup}
          </p>
        </div>
      </header>

      <img className="detail-image" src={exercise.imageUrl} alt={`Imagem do exercício ${exercise.name}`} />

      {exercise.secondaryMuscleGroups.length > 0 ? (
        <p>
          <strong>Grupos secundários:</strong> {exercise.secondaryMuscleGroups.join(', ')}
        </p>
      ) : null}

      {exercise.description != null && exercise.description.length > 0 ? (
        <p>
          <strong>Descrição:</strong> {exercise.description}
        </p>
      ) : null}

      {exercise.equipment != null && exercise.equipment.length > 0 ? (
        <p>
          <strong>Equipamento:</strong> {exercise.equipment}
        </p>
      ) : null}

      {embedUrl != null ? (
        <iframe
          className="video-preview"
          src={embedUrl}
          title={`Vídeo do exercício ${exercise.name}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : null}

      <a href={exercise.videoUrl} rel="noreferrer" target="_blank">
        Ver vídeo
      </a>

      <div className="form-actions">
        <Link className="button button-primary" to={`/exercises/${exercise.id}/edit`}>
          Editar exercício
        </Link>
        <button className="button" type="button" onClick={() => navigate('/exercises')}>
          Voltar
        </button>
      </div>
    </section>
  )
}
