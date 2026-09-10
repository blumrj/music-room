import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import apiClient from "../api/ApiClient";

const CrateContext = createContext(null);

// Matches the record-disc CSS transition — gives the pull-from-sleeve
// animation time to actually finish before the crate hands off to the
// now-playing widget, instead of cutting it off mid-slide.
const CLOSE_ON_PLAY_DELAY_MS = 550;

export function CrateProvider({ children }) {
  const [sleeves, setSleeves] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [previewTrackId, setPreviewTrackId] = useState(null);

  const refetchSleeves = useCallback(async () => {
    try {
      const tracks = await apiClient.getTracks();
      
      setSleeves(tracks);
      setIndex((i) => (tracks.length === 0 ? 0 : Math.min(i, tracks.length - 1)));
    } catch (error) {
      setSleeves([]);
    }
  }, []);

  useEffect(() => {
    refetchSleeves();
  }, [refetchSleeves]);

  const isPreviewing = previewTrackId != null;

  // Stable across renders (empty/minimal deps) so effects that depend on
  // these — AudioPlayer, in particular — don't see a "changed" function
  // and re-run just because something unrelated (like isOpen) changed.
  const open = useCallback(() => setIsOpen(true), []);
  // No longer touches playback — closing the crate (by hand, or once a
  // preview starts) and stopping a preview are independent now.
  const close = useCallback(() => setIsOpen(false), []);
  const playPreview = useCallback((id) => {
    setPreviewTrackId(id);
    setTimeout(() => setIsOpen(false), CLOSE_ON_PLAY_DELAY_MS);
  }, []);
  const stopPreview = useCallback(() => setPreviewTrackId(null), []);
  // Browsing no longer waits for playback to stop — a preview keeps
  // playing in the background while you look at other sleeves.
  const next = useCallback(() => {
    if (sleeves.length === 0) return;
    setDirection("next");
    setIndex((i) => (i + 1) % sleeves.length);
  }, [sleeves.length]);
  const prev = useCallback(() => {
    if (sleeves.length === 0) return;
    setDirection("prev");
    setIndex((i) => (i - 1 + sleeves.length) % sleeves.length);
  }, [sleeves.length]);

  const value = {
    sleeves,
    isOpen,
    index,
    direction,
    current: sleeves[index],
    isPreviewing,
    previewTrackId,
    refetchSleeves,
    open,
    close,
    playPreview,
    stopPreview,
    next,
    prev,
  };

  return (
    <CrateContext.Provider value={value}>{children}</CrateContext.Provider>
  );
}

export function useCrate() {
  const ctx = useContext(CrateContext);
  if (!ctx) throw new Error("useCrate must be used within a CrateProvider");
  return ctx;
}
