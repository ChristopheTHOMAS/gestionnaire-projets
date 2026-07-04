import { createClient } from '@/lib/supabase/server'
import StepCard from '@/components/steps/StepCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Step } from '@/types'

export const dynamic = 'force-dynamic'

export default async function LieuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: lieu, error } = await supabase
    .from('lieux')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !lieu) notFound()

  const { data: steps } = await supabase
    .from('steps')
    .select('*, lieu:lieux(*), project:projects(titre, id)')
    .eq('lieu_id', id)
    .neq('statut', 'Fait')
    .order('deadline', { ascending: true, nullsFirst: false }) as { data: (Step & { project: { titre: string; id: string } })[] | null }

  const tasksByProject = (steps ?? []).reduce((acc, s) => {
    const pid = s.project_id
    if (!acc[pid]) acc[pid] = { titre: (s as unknown as { project: { titre: string } }).project?.titre ?? 'Projet', steps: [] }
    acc[pid].steps.push(s)
    return acc
  }, {} as Record<string, { titre: string; steps: Step[] }>)

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/lieux" className="text-sky-600 text-sm hover:underline">← Lieux</Link>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{lieu.nom}</h1>
        {lieu.adresse && <p className="text-gray-500 text-sm mt-1">{lieu.adresse}</p>}
        {lieu.lat && lieu.lng && (
          <p className="text-xs text-gray-300 mt-1">{lieu.lat.toFixed(5)}, {lieu.lng.toFixed(5)}</p>
        )}
      </div>

      <h2 className="font-semibold text-gray-700 mb-3">Tâches à faire ici</h2>
      {Object.keys(tasksByProject).length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Toutes les tâches de ce lieu sont faites !</p>
      ) : (
        Object.values(tasksByProject).map(group => (
          <div key={group.titre} className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{group.titre}</p>
            <div className="space-y-2">
              {group.steps.map(s => <StepCard key={s.id} step={s} />)}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
