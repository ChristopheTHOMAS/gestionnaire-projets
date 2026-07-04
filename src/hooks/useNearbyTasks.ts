'use client'

import { useMemo } from 'react'
import { Step, Lieu } from '@/types'
import { haversineMeters, PROXIMITY_METERS } from '@/lib/geo'

export interface NearbyTask {
  step: Step
  lieu: Lieu
  distanceM: number
}

export function useNearbyTasks(
  coords: GeolocationCoordinates | null,
  steps: Step[]
): NearbyTask[] {
  return useMemo(() => {
    if (!coords) return []
    const results: NearbyTask[] = []
    for (const step of steps) {
      if (step.statut === 'Fait' || !step.lieu?.lat || !step.lieu?.lng) continue
      const d = haversineMeters(coords.latitude, coords.longitude, step.lieu.lat, step.lieu.lng)
      if (d <= PROXIMITY_METERS) results.push({ step, lieu: step.lieu, distanceM: Math.round(d) })
    }
    return results.sort((a, b) => a.distanceM - b.distanceM)
  }, [coords, steps])
}
