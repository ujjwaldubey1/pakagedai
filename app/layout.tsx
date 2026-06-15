import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "AI Packaging Generator",
  description:
    "Generate stunning AI-powered packaging concepts instantly. Describe your product and watch AI craft your perfect packaging design.",
  keywords: [
    "packaging design",
    "AI packaging",
    "packaging generator",
    "product packaging",
    "design tools",
  ],
  openGraph: {
    title: "AI Packaging Generator",
    description:
      "Visualize your perfect packaging. Describe your idea — our AI crafts a stunning packaging concept instantly.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Packaging Generator",
    description: "Visualize your perfect packaging with AI.",
  },
  other: {
    "theme-color": "#1a1208",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
