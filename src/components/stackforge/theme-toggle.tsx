"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useHasMounted();

  // Prevent flash of wrong state on first render
  if (!mounted) {
    return (
      <div className="w-6 h-6 rounded-md border-3 border-forge-text bg-forge-surface shadow-[3px_3px_0px_var(--forge-text)] opacity-30" />
    );
  }

  const isDark = theme === "dark";

  return (
    <label
      className="theme-checkbox-container inline-block"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <input
        type="checkbox"
        checked={isDark}
        onChange={() => setTheme(isDark ? "light" : "dark")}
      />
      <div className="theme-checkbox-checkmark"></div>
    </label>
  );
}
