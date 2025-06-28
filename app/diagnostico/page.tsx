import { MapDiagnostics } from "@/components/map-diagnostics"

export default function DiagnosticPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Diagnóstico del Mapa</h1>
          <p className="text-lg text-gray-600">Herramienta de diagnóstico y solución de problemas</p>
        </div>
        <MapDiagnostics />
      </div>
    </div>
  )
}
