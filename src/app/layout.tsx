import type { Metadata } from "next";
import { Inter, Syne, Playfair_Display, Dancing_Script, Great_Vibes, Space_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-curvy",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const SITE_URL = "https://stackforge.dev";
const SITE_DESCRIPTION =
  "StackForge builds premium, high-performance web experiences with precision engineering and modern design systems.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "StackForge — Engineering Digital Experiences",
  description: SITE_DESCRIPTION,
  keywords: [
    "StackForge",
    "web development",
    "digital agency",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "StackForge" }],
  icons: {
    icon: "/favicon.jpg",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "StackForge — Engineering Digital Experiences",
    description: SITE_DESCRIPTION,
    siteName: "StackForge",
    locale: "en_US",
    type: "website",
    images: [{
      url: "/logo.jpg",
      width: 1254,
      height: 1254,
      alt: "StackForge — Engineering Digital Experiences",
    }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@stackforge",
    site: "@stackforge",
    title: "StackForge — Engineering Digital Experiences",
    description: SITE_DESCRIPTION,
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF6A00" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.variable} ${syne.variable} ${playfair.variable} ${dancing.variable} ${greatVibes.variable} ${spaceMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ThemeProvider>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "StackForge",
                url: SITE_URL,
                logo: `${SITE_URL}/logo.jpg`,
                description: "Premium web development studio crafting high-performance digital experiences.",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Hyderabad",
                  addressCountry: "IN",
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  email: "hello@stackforge.dev",
                  contactType: "customer service",
                },
                sameAs: [],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "StackForge",
                url: SITE_URL,
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
                  },
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
      </body>
    </html>
  );
}
