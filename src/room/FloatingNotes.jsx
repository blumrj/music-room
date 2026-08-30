import { useCrate } from '../crate/CrateContext'
import noteSingle from '../assets/sprites/note-single.svg'
import notePair from '../assets/sprites/note-pair.svg'
import './FloatingNotes.css'

// Offsets are relative to the anchor (the turntable's top-center).
// Re-mounts fresh each time a preview starts (isPreviewing false ->
// null-return unmounts it), so the drift always begins from the same spot.
const NOTES = [
  { icon: noteSingle, x: -9, delay: 0, duration: 2.6 },
  { icon: notePair, x: 7, delay: 0.7, duration: 2.9 },
  { icon: noteSingle, x: 0, delay: 1.5, duration: 2.4 },
]

export default function FloatingNotes({ anchorX, anchorY }) {
  const { isPreviewing } = useCrate()

  if (!isPreviewing) return null

  return (
    <div className="floating-notes" style={{ left: anchorX, top: anchorY }}>
      {NOTES.map((note, i) => (
        <img
          key={i}
          src={note.icon}
          alt=""
          className="floating-note"
          style={{
            left: note.x,
            animationDelay: `${note.delay}s`,
            animationDuration: `${note.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
