import { createClient } from '@/lib/supabase/server'
import { Lieu } from '@/types'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function LieuxPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('lieux')
    .select('*, steps(id, statut)')
    .order('nom') as { data: (Lieu & { steps: { id: string; statut: string }[] })[] | null }

  const lieux = data ?? []

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Lieux</h1>
      {lieux.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <p className="text-4xl mb-3">📍</p>
          <p>Aucun lieu. Ils sont créés automatiquement avec vos projets.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lieux.map(lieu => {
            const pending = lieu.steps?.filter(s => s.statut !== 'Fait').length ?? 0
            return (
              <Link key={lieu.id} href={`/lieux/${lieu.id}`}
                className="block bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{lieu.nom}</h3>
                    {lieu.adresse && <p className="text-xs text-gray-400 mt-0.5">{lieu.adresse}</p>}
                  </div>
                  {pending > 0 && (
                    <span className="bg-sky-100 text-sky-700 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0">
                      {pending}
                    </span>
                  )}
                </div>
                {lieu.lat && lieu.lng && (
                  <p className="text-xs text-gray-300 mt-2">{lieu.lat.toFixed(4)}, {lieu.lng.toFixed(4)}</p>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
