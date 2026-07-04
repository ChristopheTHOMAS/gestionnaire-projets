'use client'

import { useState } from 'react'
import { Step, StepStatut } from '@/types'

const cycle: Record<StepStatut, StepStatut> = {
  'À faire': 'En cours',
  'En cours': 'Fait',
  'Fait': 'À faire',
}

const statusStyle: Record<StepStatut, string> = {
  'À faire': 'bg-gray-100 text-gray-600',
  'En cours': 'bg-blue-100 text-blue-700',
  'Fait': 'bg-green-100 text-green-700',
}

export default function StepCard({ step, blocked }: { step: Step; blocked?: boolean }) {
  const [statut, setStatut] = useState<StepStatut>(step.statut)
  const [loading, setLoading] = useState(false)

  async function toggleStatut() {
    if (loading) return
    const next = cycle[statut]
    setLoading(true)
    const res = await fetch(`/api/steps/${step.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut: next }),
    })
    if (res.ok) setStatut(next)
    setLoading(false)
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${blocked ? 'opacity-50 bg-gray-50' : 'bg-white'}`}>
      <button
        onClick={toggleStatut}
        disabled={loading || blocked}
        className={`text-xs px-2 py-1 rounded-full font-medium transition shrink-0 ${statusStyle[statut]}`}
      >
        {statut}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${statut === 'Fait' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {step.titre}
        </p>
        {step.lieu && (
          <p className="text-xs text-gray-400 truncate">📍 {step.lieu.nom}</p>
        )}
      </div>
      {step.deadline && (
        <span className="text-xs text-gray-400 shrink-0">
          {new Date(step.deadline).toLocaleDateString('fr-FR')}
        </span>
      )}
      {blocked && <span className="text-xs text-orange-500 shrink-0">🔒</span>}
    </div>
  )
}
