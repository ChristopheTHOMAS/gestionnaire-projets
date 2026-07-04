import { createClient } from '@/lib/supabase/server'
import { Project } from '@/types'
import ProjectCard from '@/components/projects/ProjectCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('*, steps(*)')
    .order('created_at', { ascending: false }) as { data: Project[] | null }

  const projects = data ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
        <Link href="/projects/new" className="bg-sky-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-sky-700 transition">
          + Nouveau
        </Link>
      </div>
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
