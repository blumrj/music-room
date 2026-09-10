import { useState } from "react";
import apiClient from "../../api/ApiClient";

export default function NewsletterButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await apiClient.subscribe(email);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const close = () => {
    setOpen(false);
    setStatus("idle");
    setEmail("");
  };

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
            <h2>Get notified</h2>
            {status === "done" ? (
              <p>Check your inbox to confirm — almost there.</p>
            ) : (
              <>
                <p>
                  Drop your email and you&rsquo;ll hear about it whenever a new
                  record lands in the crate.
                </p>
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" disabled={status === "submitting"}>
                    {status === "submitting" ? "Submitting…" : "Subscribe"}
                  </button>
                </form>
                {status === "error" && (
                  <p className="chrome-error">
                    Something went wrong — try again.
                  </p>
                )}
              </>
            )}
            <button type="button" className="chrome-close" onClick={close}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
