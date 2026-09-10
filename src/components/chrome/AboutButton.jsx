import { useState } from 'react'

const ABOUT_TEXT = [
  "Welcome to the Music Room! You can visit this page whenever you need a bit of music inspiration. I'm curating a running list of my favorite songs and sharing them here. Click the turntable to browse what I've currently picked out, and play 30 second previews to find something new.",
  "I made this as a fun way to explore music and share what I'm currently into. Subscribe and you'll get notified whenever a new song is added. Right now, only I can update the crate, but I'm working on letting everyone create their own profile, pick their own music, and share it with others too. Enjoy!",
]

export default function AboutButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="corner-button"
        onClick={() => setOpen(true)}
      >
        About
      </button>

      {open && (
        <div className="chrome-backdrop" onClick={() => setOpen(false)}>
          <div className="chrome-panel" onClick={(e) => e.stopPropagation()}>
            <h2>What is this?</h2>
            {ABOUT_TEXT.map((p) => (
              <p key={p.slice(0, 12)}>{p}</p>
            ))}
            <button type="button" className="chrome-close" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
