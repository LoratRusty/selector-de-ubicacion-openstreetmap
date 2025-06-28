"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Code, RefreshCw, Download, Clock } from "lucide-react"

interface DiagnosticResult {
  test: string
  status: "success" | "error" | "warning" | "loading"
  message: string
  details?: string
  timestamp: string
}

export function MapDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostic = async (test: string, testFn: () => Promise<DiagnosticResult>) => {
    const startTime = Date.now()

    setDiagnostics((prev) => [
      ...prev,
      {
        test,
        status: "loading",
        message: "Ejecutando...",
        timestamp: new Date().toISOString(),
      },
    ])

    try {
      const result = await testFn()
      const duration = Date.now() - startTime

      setDiagnostics((prev) =>
        prev.map((d) =>
          d.test === test
            ? {
                ...result,
                details: `${result.details || ""} (${duration}ms)`.trim(),
              }
            : d,
        ),
      )
    } catch (error) {
      setDiagnostics((prev) =>
        prev.map((d) =>
          d.test === test
            ? {
                test,
                status: "error" as const,
                message: "Error en la prueba",
                details: error instanceof Error ? error.message : "Error desconocido",
                timestamp: new Date().toISOString(),
              }
            : d,
        ),
      )
    }
  }

  const testNetworkConnectivity = async (): Promise<DiagnosticResult> => {
    const isOnline = navigator.onLine

    if (!isOnline) {
      return {
        test: "Conectividad de Red",
        status: "error",
        message: "Sin conexión a internet",
        details: "El navegador reporta que no hay conexión",
        timestamp: new Date().toISOString(),
      }
    }

    try {
      const response = await fetch("https://tile.openstreetmap.org/0/0/0.png", {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-cache",
      })

      return {
        test: "Conectividad de Red",
        status: "success",
        message: "Conexión a internet activa",
        details: "Acceso a OpenStreetMap confirmado",
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        test: "Conectividad de Red",
        status: "error",
        message: "Error de conectividad",
        details: "No se puede acceder a los servidores de mapas",
        timestamp: new Date().toISOString(),
      }
    }
  }

  const testLeafletLibrary = async (): Promise<DiagnosticResult> => {
    if (window.L) {
      return {
        test: "Biblioteca Leaflet",
        status: "success",
        message: "Leaflet cargado correctamente",
        details: `Versión: ${window.L.version || "Desconocida"}`,
        timestamp: new Date().toISOString(),
      }
    }

    try {
      // Intentar cargar Leaflet
      const response = await fetch("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js")
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return {
        test: "Biblioteca Leaflet",
        status: "warning",
        message: "Leaflet disponible pero no cargado",
        details: "La biblioteca se puede descargar pero no está inicializada",
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        test: "Biblioteca Leaflet",
        status: "error",
        message: "Error cargando Leaflet",
        details: error instanceof Error ? error.message : "Error desconocido",
        timestamp: new Date().toISOString(),
      }
    }
  }

  const testNominatimAPI = async (): Promise<DiagnosticResult> => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch("https://nominatim.openstreetmap.org/search?format=json&q=Madrid&limit=1", {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      return {
        test: "API Nominatim",
        status: "success",
        message: "Servicio de geocodificación disponible",
        details: `Resultados encontrados: ${data.length}`,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      let message = "Error en el servicio de geocodificación"
      let details = "Error desconocido"

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          message = "Timeout en Nominatim"
          details = "El servicio tardó más de 5 segundos en responder"
        } else if (error.message.includes("HTTP")) {
          message = "Error del servidor Nominatim"
          details = error.message
        }
      }

      return {
        test: "API Nominatim",
        status: "error",
        message,
        details,
        timestamp: new Date().toISOString(),
      }
    }
  }

  const testGeolocation = async (): Promise<DiagnosticResult> => {
    if (!navigator.geolocation) {
      return {
        test: "Geolocalización",
        status: "error",
        message: "Geolocalización no soportada",
        details: "El navegador no soporta la API de geolocalización",
        timestamp: new Date().toISOString(),
      }
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            test: "Geolocalización",
            status: "success",
            message: "Geolocalización disponible",
            details: `Precisión: ${position.coords.accuracy}m`,
            timestamp: new Date().toISOString(),
          })
        },
        (error) => {
          let message = "Error de geolocalización"
          let details = "Error desconocido"

          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "Permisos denegados"
              details = "El usuario denegó el acceso a la ubicación"
              break
            case error.POSITION_UNAVAILABLE:
              message = "Ubicación no disponible"
              details = "No se pudo determinar la ubicación"
              break
            case error.TIMEOUT:
              message = "Timeout de geolocalización"
              details = "La solicitud tardó demasiado tiempo"
              break
          }

          resolve({
            test: "Geolocalización",
            status: "warning",
            message,
            details,
            timestamp: new Date().toISOString(),
          })
        },
        { timeout: 5000 },
      )
    })
  }

  const testLocalStorage = async (): Promise<DiagnosticResult> => {
    try {
      const testKey = "map-diagnostic-test"
      const testValue = "test-data"

      localStorage.setItem(testKey, testValue)
      const retrieved = localStorage.getItem(testKey)
      localStorage.removeItem(testKey)

      if (retrieved === testValue) {
        return {
          test: "Almacenamiento Local",
          status: "success",
          message: "LocalStorage funcionando",
          details: "Las ubicaciones se pueden guardar localmente",
          timestamp: new Date().toISOString(),
        }
      } else {
        throw new Error("Datos no coinciden")
      }
    } catch (error) {
      return {
        test: "Almacenamiento Local",
        status: "error",
        message: "Error en LocalStorage",
        details: "No se pueden guardar ubicaciones localmente",
        timestamp: new Date().toISOString(),
      }
    }
  }

  const runAllDiagnostics = async () => {
    setIsRunning(true)
    setDiagnostics([])

    const tests = [
      { name: "Conectividad de Red", fn: testNetworkConnectivity },
      { name: "Biblioteca Leaflet", fn: testLeafletLibrary },
      { name: "API Nominatim", fn: testNominatimAPI },
      { name: "Geolocalización", fn: testGeolocation },
      { name: "Almacenamiento Local", fn: testLocalStorage },
    ]

    for (const test of tests) {
      await runDiagnostic(test.name, test.fn)
      // Pequeña pausa entre tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "loading":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
    }
  }

  const getStatusBadge = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Exitoso</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Advertencia</Badge>
      case "loading":
        return <Badge className="bg-blue-100 text-blue-800">Cargando</Badge>
    }
  }

  const overallStatus =
    diagnostics.length > 0
      ? diagnostics.some((d) => d.status === "error")
        ? "error"
        : diagnostics.some((d) => d.status === "warning")
          ? "warning"
          : "success"
      : "unknown"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Diagnóstico del Mapa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Ejecuta un diagnóstico completo para identificar problemas con el mapa.
            </p>
            <Button onClick={runAllDiagnostics} disabled={isRunning} size="sm">
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Ejecutando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Ejecutar Diagnóstico
                </>
              )}
            </Button>
          </div>

          {diagnostics.length > 0 && (
            <Alert variant={overallStatus === "error" ? "destructive" : "default"}>
              {overallStatus === "error" ? (
                <XCircle className="h-4 w-4" />
              ) : overallStatus === "warning" ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {overallStatus === "error"
                  ? "Problemas Detectados"
                  : overallStatus === "warning"
                    ? "Advertencias Encontradas"
                    : "Diagnóstico Completado"}
              </AlertTitle>
              <AlertDescription>
                {overallStatus === "error"
                  ? "Se encontraron errores que pueden afectar el funcionamiento del mapa."
                  : overallStatus === "warning"
                    ? "Se encontraron advertencias que podrían afectar algunas funciones."
                    : "Todos los componentes están funcionando correctamente."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {diagnostics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados del Diagnóstico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {diagnostics.map((diagnostic, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getStatusIcon(diagnostic.status)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{diagnostic.test}</h4>
                      {getStatusBadge(diagnostic.status)}
                    </div>
                    <p className="text-sm text-gray-600">{diagnostic.message}</p>
                    {diagnostic.details && <p className="text-xs text-gray-500">{diagnostic.details}</p>}
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {new Date(diagnostic.timestamp).toLocaleTimeString("es-ES")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guía de solución de problemas */}
      <Card>
        <CardHeader>
          <CardTitle>Guía de Solución de Problemas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-800">Error de Conectividad</h4>
              <ul className="text-sm text-red-700 list-disc list-inside mt-1">
                <li>Verifica tu conexión a internet</li>
                <li>Comprueba si hay un firewall bloqueando el acceso</li>
                <li>Intenta usar una red diferente</li>
                <li>Verifica que no haya problemas con tu proveedor de internet</li>
              </ul>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-yellow-800">Error de Biblioteca</h4>
              <ul className="text-sm text-yellow-700 list-disc list-inside mt-1">
                <li>Recarga la página para reintentar la carga</li>
                <li>Limpia la caché del navegador</li>
                <li>Verifica que no haya bloqueadores de contenido activos</li>
                <li>Intenta con un navegador diferente</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-800">Error de API</h4>
              <ul className="text-sm text-blue-700 list-disc list-inside mt-1">
                <li>El servicio puede estar temporalmente no disponible</li>
                <li>Intenta de nuevo en unos minutos</li>
                <li>Verifica que no haya restricciones de red</li>
                <li>Contacta al soporte si el problema persiste</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-800">Error de Geolocalización</h4>
              <ul className="text-sm text-green-700 list-disc list-inside mt-1">
                <li>Permite el acceso a la ubicación en tu navegador</li>
                <li>Verifica la configuración de privacidad</li>
                <li>Asegúrate de estar usando HTTPS</li>
                <li>Intenta buscar manualmente tu ubicación</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
