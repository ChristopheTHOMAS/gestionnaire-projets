import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

function checkAuth(req: Request) {
  const auth = req.headers.get('Authorization') ?? ''
  const key = process.env.INGEST_API_KEY
  if (!key || auth !== `Bearer ${key}`) return false
  return true
}

// POST /api/ingest — crée un projet complet avec lieux et étapes
export async function POST(req: Request) {
  if (!checkAuth(req)) return unauthorized()

  const body = await req.json()
  const { user_id, projet, lieux = [], etapes = [] } = body

  if (!user_id || !projet?.titre) {
    return NextResponse.json({ error: 'user_id et projet.titre requis' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // 1. Créer le projet
  const { data: project, error: pErr } = await supabase
    .from('projects')
    .insert({
      titre: projet.titre,
      categorie: projet.categorie ?? null,
      deadline: projet.deadline ?? null,
      statut: projet.statut ?? 'À faire',
      user_id,
    })
    .select()
    .single()

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 })

  // 2. Créer les lieux et construire une map nom → id
  const lieuMap: Record<string, string> = {}
  for (const lieu of lieux) {
    const { data: l, error: lErr } = await supabase
      .from('lieux')
      .insert({
        nom: lieu.nom,
        adresse: lieu.adresse ?? null,
        lat: lieu.lat ?? null,
        lng: lieu.lng ?? null,
        user_id,
      })
      .select()
      .single()
    if (!lErr && l) lieuMap[lieu.nom] = l.id
  }

  // 3. Insérer les étapes (sans depends_on d'abord)
  const stepMap: Record<string, string> = {} // titre → id
  const sortedEtapes = [...etapes].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0))

  for (const etape of sortedEtapes) {
    const lieu_id = etape.lieu_nom ? lieuMap[etape.lieu_nom] ?? null : null
    const { data: s, error: sErr } = await supabase
      .from('steps')
      .insert({
        project_id: project.id,
        titre: etape.titre,
        lieu_id,
        deadline: etape.deadline ?? null,
        statut: etape.statut ?? 'À faire',
        ordre: etape.ordre ?? 0,
      })
      .select()
      .single()
    if (!sErr && s) stepMap[etape.titre] = s.id
  }

  // 4. Résoudre les depends_on par titre
  for (const etape of sortedEtapes) {
    if (etape.depends_on_titre && stepMap[etape.depends_on_titre] && stepMap[etape.titre]) {
      await supabase
        .from('steps')
        .update({ depends_on: stepMap[etape.depends_on_titre] })
        .eq('id', stepMap[etape.titre])
    }
  }

  return NextResponse.json({ project_id: project.id, steps: stepMap }, { status: 201 })
}

// PATCH /api/ingest — met à jour le statut d'une étape ou d'un projet
export async function PATCH(req: Request) {
  if (!checkAuth(req)) return unauthorized()

  const body = await req.json()
  const supabase = createServiceClient()

  if (body.step_id) {
    const { data, error } = await supabase
      .from('steps')
      .update({ statut: body.statut })
      .eq('id', body.step_id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (body.project_id) {
    const { data, error } = await supabase
      .from('projects')
      .update({ statut: body.statut })
      .eq('id', body.project_id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  return NextResponse.json({ error: 'step_id ou project_id requis' }, { status: 400 })
}
