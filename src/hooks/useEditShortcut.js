import { useEffect } from "react";

const useEditShortcut = (setIsEditOpen) => {
  useEffect(() => {
    function onKeyDown(e) {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setIsEditOpen((open) => !open);
      } else if (e.key === "Escape") {
        setIsEditOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setIsEditOpen]);
};

export default useEditShortcut;
