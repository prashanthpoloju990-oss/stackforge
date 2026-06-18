"use client";

import { useCallback, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

const CONSENT_KEY = "cookie-consent";

/* ── External store for localStorage consent ── */
let cachedConsent: string | null | undefined = undefined;
const consentListeners = new Set<() => void>();

function subscribeConsent(cb: () => void) {
  consentListeners.add(cb);
  return () => consentListeners.delete(cb);
}

function getConsentSnapshot(): string | null | undefined {
  // Lazy-read from localStorage once on the client
  if (cachedConsent === undefined) {
    cachedConsent = localStorage.getItem(CONSENT_KEY);
  }
  return cachedConsent;
}

function getConsentServerSnapshot(): string | null | undefined {
  return undefined;
}

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getConsentServerSnapshot);

  const accept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "true");
    cachedConsent = "true";
    consentListeners.forEach((l) => l());
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "dismissed");
    cachedConsent = "dismissed";
    consentListeners.forEach((l) => l());
  }, []);

  // Don't render until we've checked localStorage, or if already consented/dismissed
  if (consent === undefined || consent !== null) {
    return null;
  }

  return (
    <AnimatePresence>
      {consent === null && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="
            fixed left-0 right-0
            bottom-[calc(4rem+env(safe-area-inset-bottom,0px))]
            z-30
            pointer-events-none
          "
        >
          <div
            className="
              mx-auto max-w-3xl px-4
              pointer-events-auto
              flex items-center justify-between gap-4
              flex-wrap sm:flex-nowrap
              bg-forge-surface/95 backdrop-blur-md
              border border-forge-divider
              rounded-t-lg
              px-4 py-3
              shadow-lg
            "
          >
            <p className="text-sm text-forge-text-secondary flex-1 min-w-0 text-wrap">
              We use cookies to improve your experience.
            </p>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={accept}
                className="
                  inline-flex items-center justify-center
                  h-8 px-4
                  bg-forge-accent text-white
                  text-xs font-semibold
                  rounded-md
                  transition-colors duration-200
                  hover:brightness-110
                  cursor-pointer
                "
                aria-label="Accept cookies"
              >
                Accept
              </button>

              <button
                onClick={dismiss}
                aria-label="Dismiss cookie banner"
                className="
                  inline-flex items-center justify-center
                  w-7 h-7
                  text-forge-text-secondary
                  hover:text-forge-text
                  transition-colors duration-200
                  cursor-pointer
                  rounded
                "
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
