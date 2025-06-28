"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Settings, Lightbulb, Heart, Zap, Bug } from "lucide-react"

export function Documentation() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Documentación del Selector de Ubicación</h1>
        <p className="text-gray-600">Solución 100% gratuita y de código abierto</p>
        <div className="flex justify-center items-center gap-4 text-sm">
          <Badge variant="outline" className="text-green-700 border-green-300">
            <Heart className="h-3 w-3 mr-1" />
            Código Abierto
          </Badge>
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            <Zap className="h-3 w-3 mr-1" />
            Sin Límites de Uso
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="implementation">Implementación</TabsTrigger>
          <TabsTrigger value="features">Características</TabsTrigger>
          <TabsTrigger value="troubleshooting">Solución de Problemas</TabsTrigger>
          <TabsTrigger value="integration">Integración</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Descripción General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                El Selector de Ubicación es una aplicación web completamente gratuita que utiliza tecnologías de código
                abierto para proporcionar funcionalidades de mapas interactivos sin costos ni limitaciones de API.
                Utiliza <strong>OpenStreetMap</strong> como fuente de datos cartográficos y <strong>Leaflet.js</strong>{" "}
                como biblioteca de mapas, con un sistema robusto de detección y recuperación de errores.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Funcionalidades Principales:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Mapa interactivo con múltiples capas</li>
                    <li>Búsqueda de direcciones global</li>
                    <li>Selección por clic y arrastre</li>
                    <li>Geolocalización automática</li>
                    <li>Guardado local de ubicaciones</li>
                    <li>Geocodificación inversa</li>
                    <li>Sistema de diagnóstico integrado</li>
                    <li>Recuperación automática de errores</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Tecnologías Utilizadas:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Next.js</Badge>
                    <Badge variant="outline">Leaflet.js</Badge>
                    <Badge variant="outline">OpenStreetMap</Badge>
                    <Badge variant="outline">Nominatim</Badge>
                    <Badge variant="outline">Tailwind CSS</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">🌟 Ventajas de la Solución Open Source</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                  <li>
                    <strong>Completamente gratuito:</strong> Sin costos de API ni límites de uso
                  </li>
                  <li>
                    <strong>Sin claves API:</strong> No requiere registro ni configuración externa
                  </li>
                  <li>
                    <strong>Datos actualizados:</strong> OpenStreetMap se actualiza constantemente por la comunidad
                  </li>
                  <li>
                    <strong>Privacidad:</strong> No se envían datos a servicios comerciales
                  </li>
                  <li>
                    <strong>Diagnóstico integrado:</strong> Herramientas para identificar y resolver problemas
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshooting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Diagnóstico y Solución de Problemas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">🔧 Sistema de Diagnóstico Automático</h4>
                <p className="text-sm text-blue-700">
                  La aplicación incluye un sistema completo de diagnóstico que detecta automáticamente problemas comunes
                  y proporciona soluciones específicas.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-red-800">🚨 Problemas de Conectividad</h4>
                  <div className="space-y-2 mt-2">
                    <p className="text-sm">
                      <strong>Síntomas:</strong> El mapa no carga, aparece mensaje de "Sin conexión"
                    </p>
                    <p className="text-sm">
                      <strong>Causas comunes:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm ml-4">
                      <li>Conexión a internet inestable o lenta</li>
                      <li>Firewall corporativo bloqueando OpenStreetMap</li>
                      <li>Problemas temporales con los servidores de tiles</li>
                      <li>Configuración de proxy incorrecta</li>
                    </ul>
                    <p className="text-sm">
                      <strong>Soluciones:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm ml-4">
                      <li>Verificar conexión a internet</li>
                      <li>Intentar con una red diferente</li>
                      <li>Usar el botón "Reintentar" en la interfaz</li>
                      <li>Contactar al administrador de red si es necesario</li>
                    </ul>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-yellow-800">⚠️ Errores de Biblioteca</h4>
                  <div className="space-y-2 mt-2">
                    <p className="text-sm">
                      <strong>Síntomas:</strong> Error "Leaflet no está disponible", mapa en blanco
                    </p>
                    <p className="text-sm">
                      <strong>Causas comunes:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm ml-4">
                      <li>CDN de Leaflet no accesible</li>
                      <li>Bloqueador de contenido activo</li>
                      <li>Caché del navegador corrupta</li>
                      <li>Conflictos con otras bibliotecas JavaScript</li>
                    </ul>
                    <p className="text-sm">
                      <strong>Soluciones:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm ml-4">
                      <li>Recargar la página (Ctrl+F5)</li>
                      <li>Limpiar caché del navegador</li>
                      <li>Desactivar bloqueadores de contenido temporalmente</li>
                      <li>Probar en modo incógnito</li>
                    </ul>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-purple-800">🔍 Problemas de Búsqueda</h4>
                  <div className="space-y-2 mt-2">
                    <p className="text-sm">
                      <strong>Síntomas:</strong> Búsquedas sin resultados, errores de geocodificación
                    </p>
                    <p className="text-sm">
                      <strong>Causas comunes:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm ml-4">
                      <li>Servicio Nominatim temporalmente no disponible</li>
                      <li>Consultas demasiado frecuentes (rate limiting)</li>
                      <li>Términos de búsqueda muy específicos o incorrectos</li>
                    </ul>
                    <p className="text-sm">
                      <strong>Soluciones:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm ml-4">
                      <li>Esperar unos segundos entre búsquedas</li>
                      <li>Usar términos más generales</li>
                      <li>Incluir país o región en la búsqueda</li>
                      <li>Usar coordenadas directamente si es necesario</li>
                    </ul>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-800">📍 Problemas de Geolocalización</h4>
                  <div className="space-y-2 mt-2">
                    <p className="text-sm">
                      <strong>Síntomas:</strong> "Mi Ubicación" no funciona, permisos denegados
                    </p>
                    <p className="text-sm">
                      <strong>Causas comunes:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm ml-4">
                      <li>Permisos de ubicación denegados</li>
                      <li>Sitio web no servido por HTTPS</li>
                      <li>GPS desactivado en el dispositivo</li>
                      <li>Configuración de privacidad restrictiva</li>
                    </ul>
                    <p className="text-sm">
                      <strong>Soluciones:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm ml-4">
                      <li>Permitir acceso a ubicación en el navegador</li>
                      <li>Verificar configuración de privacidad</li>
                      <li>Activar servicios de ubicación en el dispositivo</li>
                      <li>Buscar manualmente la ubicación como alternativa</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">🛠️ Herramientas de Diagnóstico</h4>
                <p className="text-sm text-gray-700 mb-3">
                  La aplicación incluye una página de diagnóstico completa que puedes usar para identificar problemas:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>
                    <strong>Test de Conectividad:</strong> Verifica el acceso a OpenStreetMap
                  </li>
                  <li>
                    <strong>Test de Biblioteca:</strong> Confirma que Leaflet se carga correctamente
                  </li>
                  <li>
                    <strong>Test de API:</strong> Prueba el servicio de geocodificación Nominatim
                  </li>
                  <li>
                    <strong>Test de Geolocalización:</strong> Verifica permisos y funcionalidad GPS
                  </li>
                  <li>
                    <strong>Test de Almacenamiento:</strong> Confirma que LocalStorage funciona
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Implementación Robusta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">1. Sistema de Recuperación de Errores</h4>
                  <p className="text-sm text-gray-600 mt-1">La aplicación incluye:</p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>Detección automática de errores de red</li>
                    <li>Reintentos automáticos con backoff exponencial</li>
                    <li>Fallbacks para servicios no disponibles</li>
                    <li>Mensajes de error informativos para el usuario</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">2. Manejo de Estados de Carga</h4>
                  <p className="text-sm text-gray-600 mt-1">Implementación de:</p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>Indicadores de progreso durante la carga</li>
                    <li>Estados de loading, error y éxito claramente diferenciados</li>
                    <li>Timeouts configurables para evitar esperas infinitas</li>
                    <li>Cleanup automático de recursos</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold">3. Optimizaciones de Rendimiento</h4>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>Carga lazy de bibliotecas externas</li>
                    <li>Debounce en búsquedas para reducir requests</li>
                    <li>Caché inteligente de resultados</li>
                    <li>Cleanup de event listeners para evitar memory leaks</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold">4. Compatibilidad Cross-Browser</h4>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>Detección de características del navegador</li>
                    <li>Polyfills para APIs no soportadas</li>
                    <li>Fallbacks para funcionalidades avanzadas</li>
                    <li>Testing en múltiples navegadores</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Funcionalidades del Mapa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">🗺️ Múltiples Capas</h4>
                    <p className="text-sm text-gray-600">
                      OpenStreetMap estándar, vista satelital (Esri) y mapa topográfico (OpenTopoMap) con tiles de error
                      personalizados.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">🔍 Búsqueda Robusta</h4>
                    <p className="text-sm text-gray-600">
                      Búsqueda con timeout, manejo de errores y resultados filtrados por relevancia.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">📍 Selección Inteligente</h4>
                    <p className="text-sm text-gray-600">
                      Marcadores personalizados con animaciones y feedback visual inmediato.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funcionalidades Avanzadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">🔧 Diagnóstico Integrado</h4>
                    <p className="text-sm text-gray-600">
                      Sistema completo de diagnóstico para identificar y resolver problemas automáticamente.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">🌐 Detección de Conectividad</h4>
                    <p className="text-sm text-gray-600">
                      Monitoreo en tiempo real del estado de la conexión con recuperación automática.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">💾 Almacenamiento Seguro</h4>
                    <p className="text-sm text-gray-600">
                      Guardado local con validación de datos y manejo de errores de almacenamiento.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Integración en Proyectos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Como Componente React con Manejo de Errores</h4>
                  <div className="bg-gray-100 p-3 rounded mt-2">
                    <code className="text-sm">
                      {`import { LocationSelector } from './components/location-selector'

function App() {
  const handleLocationSelect = (location) => {
    console.log('Nueva ubicación:', location)
  }

  const handleError = (error) => {
    console.error('Error del mapa:', error)
    // Implementar logging o notificación al usuario
  }

  return (
    <LocationSelector 
      onLocationSelect={handleLocationSelect}
      onError={handleError}
      enableDiagnostics={true}
      retryAttempts={3}
    />
  )
}`}
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold">Configuración de Monitoreo</h4>
                  <div className="bg-gray-100 p-3 rounded mt-2">
                    <code className="text-sm">
                      {`// Configurar monitoreo de errores
const mapConfig = {
  errorReporting: true,
  diagnostics: {
    enabled: true,
    autoRun: false,
    logLevel: 'warn'
  },
  network: {
    timeout: 8000,
    retries: 3,
    backoff: 'exponential'
  }
}`}
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
