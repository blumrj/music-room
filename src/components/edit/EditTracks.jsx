import { useState } from "react";
import { useCrate } from "../../context/CrateContext";
import { useAuth } from "../../context/AuthContext";
import apiclient from "../../api/ApiClient";

export default function EditTracks() {
  const { sleeves, refetchSleeves } = useCrate();
  const { logout } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [note, setNote] = useState("");
  const [searching, setSearching] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const result = await apiclient.searchDeezer(query);
      setResults(result);
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async (deezerId) => {
    setBusy(true);
    try {
      await apiclient.addTrack(deezerId, note);
      setNote("");
      setResults([]);
      setQuery("");
      await refetchSleeves();
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (id) => {
    setBusy(true);
    try {
      await apiclient.deleteTrack(id)
      await refetchSleeves();
    } finally {
      setBusy(false);
    }
  };

  const handleMove = async (i, delta) => {
    const swapWith = i + delta;
    if (swapWith < 0 || swapWith >= sleeves.length) return;
    const reordered = [...sleeves];
    [reordered[i], reordered[swapWith]] = [reordered[swapWith], reordered[i]];
    setBusy(true);
    try {
      const orderedIds = reordered.map((t) => t.id)
      await apiclient.reorderTracks(orderedIds)
      await refetchSleeves();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="edit-tracks">
      <div className="edit-header">
        <h2>Edit crate</h2>
        <button type="button" className="edit-logout" onClick={logout}>
          Log out
        </button>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search Deezer…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={searching}>
          {searching ? "Searching…" : "Search"}
        </button>
      </form>

      {results.length > 0 && (
        <div className="search-results">
          <input
            type="text"
            placeholder="A short note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <ul>
            {results.slice(0, 8).map((r) => (
              <li key={r.externalId}>
                <span>
                  {r.title} — {r.artist}
                </span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleAdd(r.externalId)}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="track-list">
        {sleeves.map((t, i) => (
          <li key={t.id}>
            <span className="track-list-title">
              {t.title} — {t.artist}
            </span>
            <div className="track-list-actions">
              <button
                type="button"
                disabled={busy || i === 0}
                onClick={() => handleMove(i, -1)}
                aria-label="Move earlier"
              >
                &uarr;
              </button>
              <button
                type="button"
                disabled={busy || i === sleeves.length - 1}
                onClick={() => handleMove(i, 1)}
                aria-label="Move later"
              >
                &darr;
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => handleRemove(t.id)}
                aria-label="Remove"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
