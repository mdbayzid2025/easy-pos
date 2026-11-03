

let loadPromise: Promise<void> | null = null

export function loadGoogleMapsPlaces(): Promise<void> {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  
  if (!key) {
    return Promise.reject(new Error('VITE_GOOGLE_MAPS_API_KEY is not set'))
  }

  if (typeof window !== 'undefined' && window.google?.maps?.places) {
    return Promise.resolve()
  }

  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps-places]'
    )

    if (existing) {
      // Script already injected — wait for the bootstrap callback
      const prev = (window as any).__googleMapsPlacesResolve
      ;(window as any).__googleMapsPlacesResolve = () => {
        prev?.()
        resolve()
      }
      return
    }

    // Expose a global callback that the Maps script will invoke when ready
    ;(window as any).__googleMapsPlacesResolve = resolve

    const script = document.createElement('script')
    script.dataset.googleMapsPlaces = 'true'
    // loading=async is the recommended pattern since 2024 — eliminates the
    // "loaded directly without loading=async" console warning.
    // script.src = [
    //   `https://maps.googleapis.com/maps/api/js`,
    //   `?key=${encodeURIComponent(key)}`,
    //   `&libraries=places`,
    //   `&loading=async`,
    //   `&callback=__googleMapsPlacesResolve`,
    // ].join('')
    script.src = [
      `https://maps.googleapis.com/maps/api/js`,
      `?key=${encodeURIComponent(key)}`,
      `&libraries=places`,
      `&loading=async`,
      `&callback=__googleMapsPlacesResolve`,
    ].join('')
    script.async = true
    script.onerror = () => {
      loadPromise = null
      reject(new Error('Failed to load Google Maps'))
    }
    document.head.appendChild(script)
  })

  return loadPromise
}