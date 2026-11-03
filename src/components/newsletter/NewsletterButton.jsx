import { useState } from "react";

export default function NewsletterButton() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className="corner-button"
        onClick={() => setOpen(true)}
      >
        Newsletter
      </button>

      {open && (
        <div className="chrome-backdrop" onClick={close}>
          <div className="chrome-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Coming soon</h2>
            <p>
              Soon you&rsquo;ll be able to get notified whenever a new record
              lands in the crate. Check back later!
            </p>
            <button type="button" className="chrome-close" onClick={close}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
