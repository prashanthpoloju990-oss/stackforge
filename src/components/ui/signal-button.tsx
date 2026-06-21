"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

export function SignalButton() {
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show tooltip briefly after 3 seconds to catch user's attention, then hide
    const timer = setTimeout(() => {
      setShowTooltip(true);
      const hideTimer = setTimeout(() => setShowTooltip(false), 5000);
      return () => clearTimeout(hideTimer);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const signalUrl = "https://signal.me/#eu/-qRYXT4JZ710su48YfIlse522mstZQ75JXB9ShjJBC472vbnvWtAVKgxdsu7KTmu";
  
  const messageTemplate = "Hello StackForge! I would like to inquire about building a custom web project with you. Could you share details regarding your services, pricing, and average delivery timeline?";

  const handleClick = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(messageTemplate);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  return (
    <>
      <div className="fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] z-30 flex items-center justify-end select-none">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !showToast && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-14 mr-2 bg-forge-surface border border-forge-divider px-3 py-1.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap hidden sm:block"
            >
              <span className="text-[12px] font-medium text-forge-text font-sans">
                Chat on Signal
              </span>
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-forge-surface border-r border-t border-forge-divider" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button wrapper for ripple effect */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing breathing ring */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#3a76f0]/30 animate-ping opacity-75 pointer-events-none scale-125" style={{ animationDuration: '3s' }} />
          
          <motion.a
            href={signalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            whileHover={{ scale: 1.1, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#1e4db7] to-[#3a76f0] hover:from-[#3a76f0] hover:to-[#5c92ff] text-white shadow-lg shadow-[#3a76f0]/20 hover:shadow-[#3a76f0]/40 transition-all duration-300 cursor-pointer border border-[#ffffff]/10"
            aria-label="Chat on Signal"
          >
            {/* Signal speech bubble icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5.5 h-5.5 text-white"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </motion.a>
        </div>
      </div>

      {/* Copy Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] right-5 z-50 bg-forge-surface border border-forge-accent/20 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-forge-accent animate-pulse shrink-0" />
            <div className="flex-1">
              <p className="text-[12px] font-bold text-forge-text font-sans">
                Inquiry copied to clipboard!
              </p>
              <p className="text-[10px] text-forge-text-secondary/70 mt-0.5 font-sans leading-normal">
                Paste (Ctrl+V) it in Signal to send the template message.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
