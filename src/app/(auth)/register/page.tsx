'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Vérifie ton email</h1>
          <p className="text-gray-500 text-sm mb-4">Un lien de confirmation a été envoyé à <strong>{email}</strong>.</p>
          <Link href="/login" className="text-sky-600 hover:underline text-sm">Retour à la connexion</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Créer un compte</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required minLength={6}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-sky-600 text-white rounded-lg py-2 font-medium hover:bg-sky-700 disabled:opacity-50 transition"
          >
            {loading ? 'Création…' : 'Créer le compte'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-500">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-sky-600 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
