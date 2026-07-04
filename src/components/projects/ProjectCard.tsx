import Link from 'next/link'
import { Project, computeProgress, deadlineUrgency } from '@/types'
import ProgressBar from './ProgressBar'

const urgencyColors = {
  overdue: 'text-red-600 bg-red-50',
  urgent: 'text-orange-600 bg-orange-50',
  soon: 'text-yellow-600 bg-yellow-50',
  normal: 'text-green-600 bg-green-50',
}

const categoryColors: Record<string, string> = {
  maison: 'bg-blue-100 text-blue-700',
  bricolage: 'bg-amber-100 text-amber-700',
  travaux: 'bg-purple-100 text-purple-700',
  autre: 'bg-gray-100 text-gray-700',
}

export default function ProjectCard({ project }: { project: Project }) {
  const steps = project.steps ?? []
  const progress = computeProgress(steps)
  const urgency = deadlineUrgency(project.deadline)

  return (
    <Link href={`/projects/${project.id}`} className="block bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-gray-900 leading-tight">{project.titre}</h3>
        {project.categorie && (
          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${categoryColors[project.categorie] ?? categoryColors.autre}`}>
            {project.categorie}
          </span>
        )}
      </div>
      <ProgressBar {...progress} />
      {project.deadline && urgency && (
        <div className={`mt-3 text-xs px-2 py-1 rounded-lg inline-block ${urgencyColors[urgency]}`}>
          {urgency === 'overdue' ? 'En retard' : `Deadline : ${new Date(project.deadline).toLocaleDateString('fr-FR')}`}
        </div>
      )}
    </Link>
  )
}
