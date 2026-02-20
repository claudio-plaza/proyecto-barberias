import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mendoza Barber Club | Reserva & Membresías",
  description: "El club de caballeros más exclusivo de Mendoza. Reserva tu turno rápido y accede a beneficios premium.",
  keywords: ["barbería", "peluquería", "Mendoza", "Argentina", "reserva de turnos", "membresía", "caballeros"],
};

import Navbar from "@/components/layout/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`} suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pt-16">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
