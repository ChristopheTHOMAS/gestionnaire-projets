import { createClient } from '@/lib/supabase/server'
import { Project, Step, computeProgress } from '@/types'
import ProgressBar from '@/components/projects/ProgressBar'
import StepCard from '@/components/steps/StepCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, steps(*, lieu:lieux(*))')
    .eq('id', id)
    .single() as { data: Project | null; error: unknown }

  if (error || !data) notFound()

  const steps = (data.steps ?? []) as Step[]
  const sortedSteps = [...steps].sort((a, b) => a.ordre - b.ordre)
  const progress = computeProgress(steps)

  const doneIds = new Set(steps.filter(s => s.statut === 'Fait').map(s => s.id))
  const isBlocked = (step: Step) => !!step.depends_on && !doneIds.has(step.depends_on)

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/projects" className="text-sky-600 text-sm hover:underline">← Projets</Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{data.titre}</h1>
            {data.categorie && (
              <span className="text-xs text-gray-500 mt-0.5 block">{data.categorie}</span>
            )}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${data.statut === 'Terminé' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            {data.statut}
          </span>
        </div>
        <ProgressBar {...progress} />
        {data.deadline && (
          <p className="text-sm text-gray-500 mt-2">
            Deadline : {new Date(data.deadline).toLocaleDateString('fr-FR')}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-gray-700">Étapes ({steps.length})</h2>
        </div>
        {sortedSteps.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Aucune étape. Demandez à Claude d&apos;en ajouter !</p>
        ) : (
          sortedSteps.map(step => (
            <StepCard key={step.id} step={step} blocked={isBlocked(step)} />
          ))
        )}
      </div>
    </div>
  )
}
