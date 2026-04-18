import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
  style: "italic",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Suno Beats | Premium Generative Instrumentals",
  description: "A professional studio for sculpting instrumental sketches. High-fidelity audio generation for producers and creators.",
  keywords: ["suno", "beats", "instrumental", "ai music", "generative audio", "studio"],
  authors: [{ name: "Suno Beats Team" }],
  openGraph: {
    title: "Suno Beats | Premium Generative Instrumentals",
    description: "Sculpt your soundscape with professional-grade AI generation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background selection:bg-white/20 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
