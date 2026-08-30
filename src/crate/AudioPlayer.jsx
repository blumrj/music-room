import { useEffect, useRef } from 'react'
import { useCrate } from './CrateContext'

// Lives at the top level, outside the crate, so playback survives the
// crate closing — the whole point of the now-playing widget is that the
// preview keeps going after the crate gets out of the way.
export default function AudioPlayer() {
  const { previewTrackId, stopPreview } = useCrate()
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (previewTrackId == null) {
      audio.pause()
      return
    }

    let cancelled = false
    fetch(`/api/tracks/${previewTrackId}/preview-url`)
      .then((r) => r.json())
      .then(({ previewUrl }) => {
        if (cancelled) return
        audio.src = previewUrl
        audio.play().catch((err) => {
          // The browser aborts an in-flight play() whenever a new load
          // supersedes it before the promise settles — expected whenever
          // this effect re-runs quickly, not a real failure.
          if (err.name === 'AbortError') return
          if (!cancelled) stopPreview()
        })
      })
      .catch(() => {
        if (!cancelled) stopPreview()
      })

    return () => {
      cancelled = true
    }
  }, [previewTrackId, stopPreview])

  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <audio ref={audioRef} onEnded={stopPreview} hidden />
}
