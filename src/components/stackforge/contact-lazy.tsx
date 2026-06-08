"use client";

import dynamic from "next/dynamic";

const Contact = dynamic(
  () => import("@/components/stackforge/contact").then((m) => ({ default: m.Contact })),
  {
    loading: () => (
      <section id="contact">
        <div className="w-full min-h-screen flex items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-forge-accent border-t-transparent" />
        </div>
      </section>
    ),
    ssr: false,
  }
);

export { Contact };
