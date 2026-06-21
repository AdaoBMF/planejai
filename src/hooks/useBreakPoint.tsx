import { useSyncExternalStore } from 'react'

// Breakpoints padrão do Tailwind CSS
const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
}

function subscribe(query: string, onStoreChange: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener('change', onStoreChange)
  return () => media.removeEventListener('change', onStoreChange)
}

function getSnapshot(query: string) {
  return window.matchMedia(query).matches
}

export function useBreakpoint(breakpoint: keyof typeof breakpoints | string) {
  const query = breakpoints[breakpoint as keyof typeof breakpoints] || `(min-width: ${breakpoint})`

  return useSyncExternalStore(
    (onStoreChange) => subscribe(query, onStoreChange),
    () => getSnapshot(query),
    () => false
  )
}
