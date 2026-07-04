'use client'

import { useState } from 'react'
import { Step } from '@/types'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useNearbyTasks } from '@/hooks/useNearbyTasks'
import Link from 'next/link'

export default function GeoAlert({ steps }: { steps: Step[] }) {
  const { coords } = useGeolocation()
  const nearby = useNearbyTasks(coords, steps)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || nearby.length === 0) return null

  const firstLieu = nearby[0].lieu

  return (
    <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
      <span className="text-2xl">📍</span>
      <div className="flex-1">
        <p className="font-semibold text-sky-800 text-sm">
          Vous êtes près de {firstLieu.nom} — {nearby.length} tâche{nearby.length > 1 ? 's' : ''} en attente
        </p>
        <div className="mt-1 flex flex-wrap gap-2">
          {nearby.slice(0, 3).map(n => (
            <Link
              key={n.step.id}
              href={`/projects/${n.step.project_id}`}
              className="text-xs text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full hover:bg-sky-200 transition"
            >
              {n.step.titre}
            </Link>
          ))}
        </div>
      </div>
      <button onClick={() => setDismissed(true)} className="text-sky-400 hover:text-sky-600 text-lg leading-none">×</button>
    </div>
  )
}
