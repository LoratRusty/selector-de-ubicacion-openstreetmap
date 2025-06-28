import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Selector de Ubicación - OpenStreetMap",
  description: "Aplicación web gratuita para seleccionar ubicaciones usando OpenStreetMap y Leaflet.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <nav className="border-b bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">Selector de Ubicación</h1>
              <Badge variant="outline" className="text-green-700 border-green-300 text-xs">
                100% Gratuito
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/">Aplicación</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/documentacion">Documentación</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/diagnostico">Diagnóstico</Link>
              </Button>
            </div>
          </div>
        </nav>
        {children}
        <Toaster />

        <footer className="border-t bg-gray-50 mt-12">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
            <p>
              Powered by{" "}
              <a
                href="https://www.openstreetmap.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                OpenStreetMap
              </a>{" "}
              &{" "}
              <a
                href="https://leafletjs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Leaflet.js
              </a>{" "}
              - Solución 100% gratuita y de código abierto
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
