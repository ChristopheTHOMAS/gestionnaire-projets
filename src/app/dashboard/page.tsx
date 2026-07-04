import { createClient } from '@/lib/supabase/server'
import { Project, Step, computeProgress, deadlineUrgency } from '@/types'
import ProjectCard from '@/components/projects/ProjectCard'
import GeoAlert from '@/components/geo/GeoAlert'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*, steps(*, lieu:lieux(*))')
    .order('created_at', { ascending: false }) as { data: Project[] | null }

  const allProjects = projects ?? []
  const allSteps = allProjects.flatMap(p => p.steps ?? []) as Step[]

  const totalProjects = allProjects.length
  const totalSteps = allSteps.length
  const overdueCount = allProjects.filter(p => deadlineUrgency(p.deadline) === 'overdue' && p.statut !== 'Terminé').length
  const doneCount = allProjects.filter(p => p.statut === 'Terminé').length

  const activeProjects = allProjects.filter(p => p.statut !== 'Terminé')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/projects/new" className="bg-sky-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-sky-700 transition">
          + Nouveau projet
        </Link>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Projets actifs', value: totalProjects - doneCount, color: 'text-sky-700' },
          { label: 'Étapes totales', value: totalSteps, color: 'text-gray-700' },
          { label: 'En retard', value: overdueCount, color: 'text-red-600' },
          { label: 'Terminés', value: doneCount, color: 'text-green-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-4">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerte géo (client-side) */}
      <GeoAlert steps={allSteps} />

      {/* Grille projets actifs */}
      {activeProjects.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <p className="text-4xl mb-3">🏗️</p>
          <p className="font-medium">Aucun projet en cours</p>
          <Link href="/projects/new" className="mt-4 inline-block text-sky-600 text-sm hover:underline">
            Créer votre premier projet
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeProjects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  )
}
