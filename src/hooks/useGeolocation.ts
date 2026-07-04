'use client'

import { useState, useEffect } from 'react'

export function useGeolocation() {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setError('Géolocalisation non supportée')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => setCoords(pos.coords),
      err => setError(err.message),
      { enableHighAccuracy: false, timeout: 10000 }
    )
  }, [])

  return { coords, error }
}
