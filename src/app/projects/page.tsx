import { createClient } from '@/lib/supabase/server'
import { Project, Step, deadlineUrgency } from '@/types'
import ProjectCard from '@/components/projects/ProjectCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const URGENCY_RANK: Record<string, number> = { overdue: 0, urgent: 1, soon: 2, normal: 3 }
type ProjectWithSteps = Project & { steps: (Step & { lieu?: { id: string; nom: string } })[] }

interface SearchParams {
  statut?: string
  categorie?: string
  lieu?: string
  tri?: string
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { statut = 'all', categorie = 'all', lieu = 'all', tri = 'recent' } = await searchParams
  const supabase = await createClient()

  const [{ data }, { data: lieuxData }] = await Promise.all([
    supabase
      .from('projects')
      .select('*, steps(*, lieu:lieux(id, nom))')
      .order('created_at', { ascending: false }) as unknown as Promise<{ data: ProjectWithSteps[] | null }>,
    supabase.from('lieux').select('id, nom').order('nom'),
  ])

  let projects = data ?? []
  const lieux = lieuxData ?? []

  if (statut !== 'all') projects = projects.filter(p => p.statut === statut)
  if (categorie !== 'all') projects = projects.filter(p => p.categorie === categorie)
  if (lieu !== 'all') projects = projects.filter(p => p.steps.some(s => s.lieu?.id === lieu))

  projects = [...projects].sort((a, b) => {
    if (tri === 'deadline') {
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return a.deadline.localeCompare(b.deadline)
    }
    if (tri === 'urgence') {
      const ra = URGENCY_RANK[deadlineUrgency(a.deadline) ?? 'normal'] ?? 4
      const rb = URGENCY_RANK[deadlineUrgency(b.deadline) ?? 'normal'] ?? 4
      return ra - rb
    }
    return b.created_at.localeCompare(a.created_at)
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
        <Link href="/projects/new" className="bg-sky-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-sky-700 transition">
          + Nouveau
        </Link>
      </div>

      <form className="flex flex-wrap gap-2 mb-6" method="get">
        <select name="statut" defaultValue={statut} className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700">
          <option value="all">Tous les statuts</option>
          <option value="À faire">À faire</option>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
        </select>
        <select name="categorie" defaultValue={categorie} className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700">
          <option value="all">Toutes catégories</option>
          <option value="maison">Maison</option>
          <option value="bricolage">Bricolage</option>
          <option value="travaux">Travaux</option>
          <option value="autre">Autre</option>
        </select>
        <select name="lieu" defaultValue={lieu} className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700">
          <option value="all">Tous les lieux</option>
          {lieux.map(l => <option key={l.id} value={l.id}>{l.nom}</option>)}
        </select>
        <select name="tri" defaultValue={tri} className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700">
          <option value="recent">Plus récents</option>
          <option value="deadline">Deadline proche</option>
          <option value="urgence">Urgence</option>
        </select>
        <button type="submit" className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition">
          Filtrer
        </button>
        {(statut !== 'all' || categorie !== 'all' || lieu !== 'all' || tri !== 'recent') && (
          <Link href="/projects" className="text-sm text-gray-400 px-2 py-1.5 hover:text-gray-600 transition">
            Réinitialiser
          </Link>
        )}
      </form>

      {projects.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <p className="text-4xl mb-3">📋</p>
          <p>Aucun projet. Créez-en un ou demandez à Claude !</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  )
}
