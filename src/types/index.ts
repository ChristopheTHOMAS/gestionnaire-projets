export type StepStatut = 'À faire' | 'En cours' | 'Fait'
export type ProjectStatut = 'À faire' | 'En cours' | 'Terminé'

export interface Lieu {
  id: string
  nom: string
  adresse?: string
  lat?: number
  lng?: number
  user_id: string
  created_at: string
}

export interface Project {
  id: string
  titre: string
  categorie?: string
  deadline?: string
  statut: ProjectStatut
  user_id: string
  created_at: string
  steps?: Step[]
}

export interface Step {
  id: string
  project_id: string
  titre: string
  lieu_id?: string
  lieu?: Lieu
  deadline?: string
  statut: StepStatut
  ordre: number
  depends_on?: string
  created_at: string
}

export interface ProjectProgress {
  total: number
  done: number
  percent: number
}

export function computeProgress(steps: Step[]): ProjectProgress {
  const total = steps.length
  const done = steps.filter(s => s.statut === 'Fait').length
  return { total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) }
}

export function deadlineUrgency(deadline?: string): 'overdue' | 'urgent' | 'soon' | 'normal' | null {
  if (!deadline) return null
  const now = new Date()
  const d = new Date(deadline)
  const diff = Math.ceil((d.getTime() - now.getTime()) / 86400000)
  if (diff < 0) return 'overdue'
  if (diff <= 7) return 'urgent'
  if (diff <= 30) return 'soon'
  return 'normal'
}
