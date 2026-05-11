import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Piawai Invitation - Phinisi Kit",
  description: "Koleksi Tema Undangan",
  metadataBase: new URL("https://phinisi-invitation.vercel.app"), // Ganti dengan domain asli Anda nanti
  icons: {
    icon: "/images/logo/3.svg",
  },
  openGraph: {
    title: "Piawai Invitation - Phinisi Kit",
    description: "Koleksi Tema Undangan",
    url: "https://phinisi-invitation.vercel.app",
    siteName: "Piawai Invitation",
    images: [
      {
        url: "/images/logo/3.png", // WAJIB PNG/JPG untuk share icon
        width: 1200,
        height: 630,
        alt: "Piawai Invitation Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Piawai Invitation - Phinisi Kit",
    description: "Koleksi Tema Undangan",
    images: ["/images/logo/3.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}  bg-gray-50`}>{children}</body>
    </html>
  );
}
