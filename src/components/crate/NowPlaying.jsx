import { useCrate } from '../../context/CrateContext'
import './NowPlaying.css'

export default function NowPlaying() {
  const { isOpen, sleeves, previewTrackId, stopPreview } = useCrate()

  // Looked up by id, not `current` — browsing can move to a different
  // sleeve than whatever's actually playing, so this always has to show
  // the playing track, regardless of what the crate happens to be
  // scrolled to when it closes.
  const playingTrack = sleeves.find((t) => t.id === previewTrackId)

  // Hidden whenever the crate itself is open — the crate's own view
  // already shows the sleeve + Stop control in that case.
  if (isOpen || !playingTrack) return null

  return (
    <div className="now-playing">
      <div className="now-playing-art">
        <div
          className="now-playing-cover"
          style={{ backgroundImage: `url(${playingTrack.coverUrl})` }}
        />
        <div className="now-playing-record" />
      </div>
      <div className="now-playing-info">
        <span className="now-playing-title">{playingTrack.title}</span>
        <span className="now-playing-artist">{playingTrack.artist}</span>
      </div>
      <button type="button" className="now-playing-stop" onClick={stopPreview}>
        Stop
      </button>
    </div>
  )
}
