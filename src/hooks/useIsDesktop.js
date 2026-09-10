import { useEffect, useState } from 'react'

// The room stage renders at a fixed 960px (COLS * UNIT * SCALE, see
// constants.js) and isn't built to reflow — below this, showing it just
// means clipping instead of a real mobile layout.
const QUERY = '(min-width: 1024px)'

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = (e) => setIsDesktop(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isDesktop
}
