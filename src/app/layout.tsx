import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "StackForge — Engineering Digital Experiences",
    description:
      "Premium web development studio. We build fast, beautiful, scalable digital products.",
    siteName: "StackForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackForge — Engineering Digital Experiences",
    description:
      "Premium web development studio. We build fast, beautiful, scalable digital products.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
