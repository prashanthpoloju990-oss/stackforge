"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-xl space-y-6">
        {/* Large 404 number */}
        <h1
          className="text-fluid-display font-syne font-bold leading-none select-none"
          style={{
            color: "var(--forge-accent)",
            opacity: 0.12,
          }}
          aria-hidden="true"
        >
          404
        </h1>

        {/* Foreground 404 */}
        <h1
          className="text-fluid-display font-syne font-bold leading-none text-forge-text"
        >
          404
        </h1>

        {/* Subtitle */}
        <h2 className="text-fluid-h2 font-playfair text-forge-text">
          Page not found
        </h2>

        {/* Description */}
        <p className="text-fluid-body-lg text-forge-text-secondary/60 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Back to Home button */}
        <div className="pt-4">
          <Link
            href="/"
            className="btn-primary inline-flex items-center gap-2 bg-forge-accent text-white rounded-full px-8 py-3 text-fluid-body font-medium transition-all duration-250"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
