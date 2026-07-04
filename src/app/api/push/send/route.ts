import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, body, url } = await req.json()

  const serviceClient = createServiceClient()
  const { data: subs } = await serviceClient
    .from('push_subscriptions')
    .select('subscription')
    .eq('user_id', user.id)

  if (!subs || subs.length === 0) return NextResponse.json({ sent: 0 })

  const webpush = await import('web-push').catch(() => null)
  if (!webpush) return NextResponse.json({ error: 'web-push not installed' }, { status: 500 })

  webpush.setVapidDetails(
    'mailto:admin@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )

  let sent = 0
  for (const sub of subs) {
    try {
      await webpush.sendNotification(sub.subscription, JSON.stringify({ title, body, url }))
      sent++
    } catch {}
  }

  return NextResponse.json({ sent })
}
