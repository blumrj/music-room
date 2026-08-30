import { useState } from 'react'

// Placeholder copy for now — swap for the real "what is this" text
// whenever it's written.
const LOREM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
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
            {LOREM.map((p) => (
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
