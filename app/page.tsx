"use client"

import { LocationSelector } from "@/components/location-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Selector de Ubicación</h1>
          <p className="text-lg text-gray-600">Selecciona tu ubicación usando OpenStreetMap - 100% Gratuito</p>
          <div className="flex justify-center items-center gap-2 text-sm text-green-700">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            Powered by OpenStreetMap & Leaflet.js
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">🗺️ Mapa Interactivo</CardTitle>
            <CardDescription className="text-center">
              Busca una dirección o haz clic en el mapa para seleccionar tu ubicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LocationSelector />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
