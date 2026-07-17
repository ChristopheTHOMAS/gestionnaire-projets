import Link from 'next/link'

const steps = [
  {
    icon: '🔑',
    title: 'Se connecter',
    body: (
      <>
        <p>Ouvre l&apos;appli, mets ton email et ton mot de passe. Tu resteras connecté d&apos;une visite à l&apos;autre, pas besoin de le refaire à chaque fois.</p>
      </>
    ),
  },
  {
    icon: '🏠',
    title: 'Le tableau de bord',
    body: (
      <p>C&apos;est la première page. Elle montre d&apos;un coup d&apos;œil combien de projets sont en cours, combien d&apos;étapes au total, ce qui est en retard, et ce qui est terminé. En dessous, chaque projet actif apparaît en carte avec sa barre de progression.</p>
    ),
    preview: (
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-lg font-bold text-sky-700">3</p>
            <p className="text-[11px] text-gray-500">Projets actifs</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-lg font-bold text-red-600">1</p>
            <p className="text-[11px] text-gray-500">En retard</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">Rénovation cuisine</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">maison</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full" style={{ width: '60%' }} />
          </div>
          <div className="flex justify-between text-[11px] text-gray-400 mt-1">
            <span>3/5 étapes</span><span>60%</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: '➕',
    title: 'Créer un projet',
    body: (
      <p>Clique sur le bouton <strong className="text-gray-900">« + Nouveau »</strong> en haut de la page. Donne-lui un nom, une catégorie, et une date limite si tu en as une. Tu peux ensuite lui ajouter des étapes, chacune avec son lieu et sa date.</p>
    ),
    tip: 'Le plus simple : décris-moi ton projet en conversation, je le crée pour toi avec toutes ses étapes d’un coup.',
  },
  {
    icon: '✅',
    title: 'Cocher les étapes',
    body: (
      <p>Ouvre un projet pour voir ses étapes. Coche-les au fur et à mesure — la barre de progression se met à jour toute seule. Une étape grisée est <strong className="text-gray-900">bloquée</strong> tant que celle dont elle dépend n&apos;est pas finie.</p>
    ),
    preview: (
      <div className="mt-4 bg-gray-50 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center gap-2.5 text-sm text-gray-400 line-through">
          <span className="w-4 h-4 rounded bg-sky-500 flex items-center justify-center text-white text-[10px]">✓</span>
          Démonter l&apos;ancien plan de travail
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-900">
          <span className="w-4 h-4 rounded border-2 border-gray-300" />
          Poser le nouveau carrelage
        </div>
      </div>
    ),
  },
  {
    icon: '📍',
    title: 'Les tâches autour de toi',
    body: (
      <p>Quand tu ouvres l&apos;appli, elle regarde discrètement où tu es. Si une tâche est liée à un endroit proche, un encart apparaît en haut pour te le rappeler. La page <strong className="text-gray-900">Lieux</strong> te montre aussi, pour un lieu donné, tout ce qu&apos;il reste à y faire.</p>
    ),
    preview: (
      <div className="mt-4 flex items-start gap-3 bg-sky-50 rounded-xl p-3">
        <span className="text-xl">📍</span>
        <span className="text-sm text-sky-800">Vous êtes près de <strong>Leroy Merlin</strong> — 2 tâches en attente</span>
      </div>
    ),
  },
  {
    icon: '📱',
    title: 'L’installer sur ton téléphone',
    body: (
      <>
        <p><strong className="text-gray-900">Sur iPhone :</strong> ouvre l&apos;appli dans Safari, appuie sur l&apos;icône de partage, puis « Sur l&apos;écran d&apos;accueil ».</p>
        <p className="mt-2"><strong className="text-gray-900">Sur Android :</strong> ouvre l&apos;appli dans Chrome, appuie sur les trois points en haut à droite, puis « Ajouter à l&apos;écran d&apos;accueil ».</p>
      </>
    ),
  },
  {
    icon: '💬',
    title: 'Tout faire en en parlant à Claude',
    body: (
      <p>Tu n&apos;es jamais obligé de cliquer dans l&apos;appli. Parle-m&apos;en simplement, comme dans un message, et je mets ton tableau de bord à jour à ta place.</p>
    ),
    preview: (
      <div className="mt-4 space-y-2">
        <div className="bg-sky-50 rounded-2xl rounded-br-md px-3 py-2 text-sm text-gray-800 ml-auto max-w-[85%] w-fit">
          J&apos;ai un nouveau projet : refaire la terrasse.
        </div>
        <div className="bg-gray-50 rounded-2xl rounded-bl-md px-3 py-2 text-sm text-gray-800 max-w-[85%] w-fit">
          C&apos;est noté, je l&apos;ajoute à ton tableau de bord.
        </div>
        <div className="bg-sky-50 rounded-2xl rounded-br-md px-3 py-2 text-sm text-gray-800 ml-auto max-w-[85%] w-fit">
          Où j&apos;en suis sur mes projets ?
        </div>
        <div className="bg-gray-50 rounded-2xl rounded-bl-md px-3 py-2 text-sm text-gray-800 max-w-[85%] w-fit">
          Je regarde ton tableau de bord et je te fais le point.
        </div>
      </div>
    ),
  },
]

export default function GuidePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Guide d&apos;utilisation</h1>
      <p className="text-sm text-gray-500 mb-6">Comment utiliser Mes Projets, étape par étape.</p>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={step.title} className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none">{step.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-0.5">Étape {i + 1}</p>
                <h2 className="font-semibold text-gray-900 mb-2">{step.title}</h2>
                <div className="text-sm text-gray-600">{step.body}</div>
                {step.tip && (
                  <div className="mt-3 flex items-start gap-2 bg-amber-50 rounded-xl px-3 py-2 text-xs text-amber-800">
                    <span>💡</span><span>{step.tip}</span>
                  </div>
                )}
                {step.preview}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-400 text-center mt-8">
        Une question, un blocage ? Dis-le simplement à Claude, ou retourne au{' '}
        <Link href="/dashboard" className="text-sky-600 hover:underline">tableau de bord</Link>.
      </p>
    </div>
  )
}
