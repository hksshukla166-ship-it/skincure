import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ScrollProgress, BackToTop } from "@/components/layout/ScrollProgress";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "SKIN CURE | Premium Dermatology Clinic Bilaspur",
    template: "%s | SKIN CURE",
  },
  description:
    "SKIN CURE - Premium dermatology clinic in Bilaspur by Dr. Ajay Pandey. Expert skin, hair & nail treatments. Book appointment online.",
  keywords: [
    "dermatologist Bilaspur",
    "skin clinic Bilaspur",
    "Dr Ajay Pandey",
    "SKIN CURE",
    "skin treatment",
    "hair loss treatment",
    "laser treatment",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "SKIN CURE",
    title: "SKIN CURE | Premium Dermatology Clinic Bilaspur",
    description: "Expert dermatology care by Dr. Ajay Pandey in Bilaspur, Chhattisgarh",
  },
  twitter: {
    card: "summary_large_image",
    title: "SKIN CURE | Premium Dermatology Clinic",
    description: "Expert skin, hair & nail care in Bilaspur",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e3a8a" />
      </head>
      <body className="font-sans">
        <LanguageProvider>
          <ScrollProgress />
          {children}
          <BackToTop />
          <Toaster position="top-center" richColors />
        </LanguageProvider>
      </body>
    </html>
  );
}
