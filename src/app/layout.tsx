import type { Metadata } from "next";
import { Inter, Syne, Playfair_Display, Dancing_Script, Space_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
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
  weight: ["400", "700", "900"],
  display: "swap",
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StackForge — Engineering Digital Experiences",
  description:
    "StackForge builds premium, high-performance web experiences with precision engineering and modern design systems.",
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
  openGraph: {
    title: "StackForge — Engineering Digital Experiences",
    description:
      "Premium web development studio. We build fast, beautiful, scalable digital products.",
    siteName: "StackForge",
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
    title: "StackForge — Engineering Digital Experiences",
    description:
      "Premium web development studio. We build fast, beautiful, scalable digital products.",
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
      <body className={`${inter.variable} ${syne.variable} ${playfair.variable} ${dancing.variable} ${spaceMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "StackForge",
              url: "https://stackforge.dev",
              logo: "https://stackforge.dev/logo.jpg",
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
            }),
          }}
        />
      </body>
    </html>
  );
}
