import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/komponen/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portofolio - Muhammad Rifqi Nabil",
  description: "Website CV/portofolio: profil, skill, dan project (IT Support & Development).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/*
          Layout global:
          - kasih background + container biar semua halaman konsisten
          - Navbar ditaruh di sini supaya gak perlu copy-paste di tiap page
        */}
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
          <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-10">
            <Navbar />
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
