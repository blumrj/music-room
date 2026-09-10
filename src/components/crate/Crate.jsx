import { useCrate } from '../../context/CrateContext'
import './Crate.css'

export default function Crate() {
  const {
    isOpen,
    sleeves,
    index,
    direction,
    current,
    previewTrackId,
    playPreview,
    stopPreview,
    next,
    prev,
    close,
  } = useCrate()

  if (!isOpen) return null
  if (!current) return null

  // Whether the sleeve on screen right now is the one actually playing —
  // not the same as "something is playing", since browsing is free to
  // move to other sleeves while a preview keeps going in the background.
  const isCurrentPlaying = current.id === previewTrackId

  // Wrap around the ends of the crate — with 3+ tracks these two are
  // always distinct from `current`; with fewer, skip so a peek never
  // shows the same sleeve that's already up front.
  const behind1 = sleeves.length > 1 ? sleeves[(index + 1) % sleeves.length] : null
  const behind2 = sleeves.length > 2 ? sleeves[(index + 2) % sleeves.length] : null

  return (
    <div className="crate-backdrop" onClick={close}>
      <div className="crate-panel" onClick={(e) => e.stopPropagation()}>
        <h2 className="crate-title">Crate</h2>

        <div className="browser">
          <button
            type="button"
            className="nav-arrow"
            onClick={prev}
            aria-label="Previous sleeve"
          >
            &lsaquo;
          </button>

          <div className="stack">
            <div className="sleeve-anchor">
              {behind2 && (
                <div
                  className="peek peek-2"
                  style={{ backgroundImage: `url(${behind2.coverUrl})` }}
                />
              )}
              {behind1 && (
                <div
                  className="peek peek-1"
                  style={{ backgroundImage: `url(${behind1.coverUrl})` }}
                />
              )}
              <div
                key={current.id}
                className={`current-sleeve slide-${direction ?? 'none'}`}
              >
                <div
                  className="sleeve-cover"
                  style={{ backgroundImage: `url(${current.coverUrl})` }}
                />
                <div className={`record-disc${isCurrentPlaying ? ' pulled' : ''}`} />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="nav-arrow"
            onClick={next}
            aria-label="Next sleeve"
          >
            &rsaquo;
          </button>
        </div>

        <div className="sleeve-meta">
          <h3>{current.title}</h3>
          <p className="selected-artist">
            {current.artist} — {current.albumName}
          </p>
          {current.note && (
            <p className="selected-note">&ldquo;{current.note}&rdquo;</p>
          )}
          <button
            type="button"
            className="preview-button"
            onClick={() => (isCurrentPlaying ? stopPreview() : playPreview(current.id))}
          >
            {isCurrentPlaying ? 'Stop' : 'Listen to preview'}
          </button>
        </div>
      </div>
    </div>
  )
}
