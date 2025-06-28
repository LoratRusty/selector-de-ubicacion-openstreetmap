"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  MapPin,
  Search,
  Save,
  Trash2,
  Navigation,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationData {
  lat: number;
  lng: number;
  address: string;
  timestamp: string;
}

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

interface MapError {
  type: "network" | "script" | "api" | "initialization" | "unknown";
  message: string;
  details?: string;
  timestamp: string;
}

// Declaración global para Leaflet
declare global {
  interface Window {
    L: any;
  }
}

export function LocationSelector() {
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [savedLocations, setSavedLocations] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [mapLayer, setMapLayer] = useState("osm");
  const [mapError, setMapError] = useState<MapError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (mapError?.type === "network") {
        toast({
          title: "Conexión restaurada",
          description: "Reintentando cargar el mapa...",
        });
        retryMapInitialization();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setMapError({
        type: "network",
        message: "Sin conexión a internet",
        details: "Verifica tu conexión y vuelve a intentar",
        timestamp: new Date().toISOString(),
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Verificar estado inicial
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [mapError]);

  // Cargar ubicaciones guardadas del localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("savedLocations");
      if (saved) {
        const parsedLocations = JSON.parse(saved);
        setSavedLocations(
          Array.isArray(parsedLocations) ? parsedLocations : []
        );
      }
    } catch (error) {
      console.error("Error cargando ubicaciones guardadas:", error);
      toast({
        title: "Error de almacenamiento",
        description: "No se pudieron cargar las ubicaciones guardadas.",
        variant: "destructive",
      });
    }
  }, []);

  // Función para limpiar recursos del mapa
  const cleanupMap = useCallback(() => {
    if (map) {
      try {
        map.remove();
      } catch (error) {
        console.warn("Error limpiando mapa:", error);
      }
    }
    setMap(null);
    setMarker(null);
  }, [map]);

  // Función para verificar conectividad de red
  const checkNetworkConnectivity = async (): Promise<boolean> => {
    try {
      const response = await fetch("https://tile.openstreetmap.org/0/0/0.png", {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-cache",
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  // Función para cargar Leaflet con manejo de errores
  const loadLeafletLibrary = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.L) {
        resolve();
        return;
      }

      setLoadingProgress(10);

      // Cargar CSS
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      cssLink.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      cssLink.crossOrigin = "";

      cssLink.onload = () => {
        setLoadingProgress(50);

        // Cargar JS
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.integrity =
          "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
        script.crossOrigin = "";

        script.onload = () => {
          setLoadingProgress(100);
          setTimeout(resolve, 100); // Pequeña pausa para asegurar que L esté disponible
        };

        script.onerror = (error) => {
          reject(new Error(`Error cargando Leaflet JS: ${error}`));
        };

        // Timeout para evitar carga infinita
        setTimeout(() => {
          if (!window.L) {
            reject(new Error("Timeout cargando Leaflet"));
          }
        }, 10000);

        document.head.appendChild(script);
      };

      cssLink.onerror = (error) => {
        reject(new Error(`Error cargando Leaflet CSS: ${error}`));
      };

      document.head.appendChild(cssLink);
    });
  };

  // Función para inicializar el mapa con manejo de errores
  const initializeMap = useCallback(async () => {
    try {
      if (!mapRef.current) {
        throw new Error("Contenedor del mapa no encontrado");
      }

      if (!window.L) {
        throw new Error("Leaflet no está disponible");
      }

      // Limpiar mapa anterior si existe
      cleanupMap();

      // Configuración inicial del mapa (centrado en Madrid, España)
      const mapOptions = {
        center: [10.4806, -66.9036] as [number, number],
        zoom: 8, // Puedes usar 12 para un zoom adecuado en ciudad
        zoomControl: true,
        attributionControl: true,
        preferCanvas: true,
        maxZoom: 19,
        minZoom: 2,
      };

      const leafletMap = window.L.map(mapRef.current, mapOptions);

      // Verificar que el mapa se creó correctamente
      if (!leafletMap) {
        throw new Error("No se pudo crear la instancia del mapa");
      }

      // Capas de mapa disponibles con fallbacks
      const mapLayers = {
        osm: window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
            errorTileUrl:
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OTk5OSI+RXJyb3I8L3RleHQ+PC9zdmc+",
          }
        ),
        satellite: window.L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution: '© <a href="https://www.esri.com/">Esri</a>',
            maxZoom: 19,
            errorTileUrl:
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iIzM0MzQzNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2NjY2NjYyI+U2F0w6lsaXRlPC90ZXh0Pjwvc3ZnPg==",
          }
        ),
        topo: window.L.tileLayer(
          "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          {
            attribution: '© <a href="https://opentopomap.org">OpenTopoMap</a>',
            maxZoom: 17,
            errorTileUrl:
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iIzJkNGEyMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2NjY2NjYyI+VG9wbzwvdGV4dD48L3N2Zz4=",
          }
        ),
      };

      // Agregar capa inicial con manejo de errores
      const initialLayer =
        mapLayers[mapLayer as keyof typeof mapLayers] || mapLayers.osm;

      initialLayer.on("tileerror", (e: any) => {
        console.warn("Error cargando tile:", e);
      });

      initialLayer.addTo(leafletMap);
      setMap(leafletMap);

      // Crear marcador inicial con icono personalizado
      const customIcon = window.L.divIcon({
        className: "custom-marker",
        html: `
          <div class="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
            <div class="w-3 h-3 bg-white rounded-full"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const leafletMarker = window.L.marker([40.4168, -3.7038], {
        draggable: true,
        icon: customIcon,
      }).addTo(leafletMap);

      setMarker(leafletMarker);

      // Event listeners con manejo de errores
      leafletMap.on("click", (event: any) => {
        try {
          const lat = event.latlng.lat;
          const lng = event.latlng.lng;
          updateLocation(lat, lng, leafletMap, leafletMarker);
        } catch (error) {
          console.error("Error en click del mapa:", error);
          toast({
            title: "Error",
            description: "No se pudo procesar la selección en el mapa.",
            variant: "destructive",
          });
        }
      });

      leafletMarker.on("dragend", (event: any) => {
        try {
          const lat = event.target.getLatLng().lat;
          const lng = event.target.getLatLng().lng;
          updateLocation(lat, lng, leafletMap, leafletMarker);
        } catch (error) {
          console.error("Error arrastrando marcador:", error);
          toast({
            title: "Error",
            description: "No se pudo procesar el movimiento del marcador.",
            variant: "destructive",
          });
        }
      });

      // Función global para cambiar capas
      window.changeMapLayer = (layerType: string) => {
        try {
          leafletMap.eachLayer((layer: any) => {
            if (layer !== leafletMarker) {
              leafletMap.removeLayer(layer);
            }
          });
          const newLayer = mapLayers[layerType as keyof typeof mapLayers];
          if (newLayer) {
            newLayer.addTo(leafletMap);
          }
        } catch (error) {
          console.error("Error cambiando capa:", error);
          toast({
            title: "Error",
            description: "No se pudo cambiar el tipo de mapa.",
            variant: "destructive",
          });
        }
      };

      // Limpiar error si la inicialización fue exitosa
      setMapError(null);
      setRetryCount(0);
      setIsLoading(false);

      toast({
        title: "Mapa cargado",
        description: "El mapa se ha cargado correctamente.",
      });
    } catch (error) {
      console.error("Error inicializando mapa:", error);

      const mapError: MapError = {
        type: "initialization",
        message: "Error inicializando el mapa",
        details: error instanceof Error ? error.message : "Error desconocido",
        timestamp: new Date().toISOString(),
      };

      setMapError(mapError);
      setIsLoading(false);
    }
  }, [mapLayer, cleanupMap, toast]);

  // Función para reintentar la inicialización del mapa
  const retryMapInitialization = useCallback(async () => {
    if (retryCount >= 3) {
      setMapError({
        type: "unknown",
        message: "Máximo número de reintentos alcanzado",
        details: "Por favor, recarga la página o verifica tu conexión",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    setIsLoading(true);
    setMapError(null);
    setRetryCount((prev) => prev + 1);

    // Verificar conectividad antes de reintentar
    const isConnected = await checkNetworkConnectivity();
    if (!isConnected) {
      setMapError({
        type: "network",
        message: "Sin conexión a internet",
        details: "Verifica tu conexión y vuelve a intentar",
        timestamp: new Date().toISOString(),
      });
      setIsLoading(false);
      return;
    }

    try {
      await loadLeafletLibrary();
      await initializeMap();
    } catch (error) {
      console.error("Error en reintento:", error);

      const errorType =
        error instanceof Error && error.message.includes("network")
          ? "network"
          : "script";

      setMapError({
        type: errorType,
        message: "Error cargando el mapa",
        details: error instanceof Error ? error.message : "Error desconocido",
        timestamp: new Date().toISOString(),
      });
      setIsLoading(false);
    }
  }, [retryCount, initializeMap]);

  // Inicializar mapa al montar el componente
  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        setLoadingProgress(0);

        // Verificar conectividad
        const isConnected = await checkNetworkConnectivity();
        if (!isConnected) {
          throw new Error("Sin conexión a internet");
        }

        await loadLeafletLibrary();
        await initializeMap();
      } catch (error) {
        console.error("Error inicial del mapa:", error);

        const errorType =
          error instanceof Error && error.message.includes("internet")
            ? "network"
            : "script";

        setMapError({
          type: errorType,
          message: "Error cargando el mapa",
          details: error instanceof Error ? error.message : "Error desconocido",
          timestamp: new Date().toISOString(),
        });
        setIsLoading(false);
      }
    };

    initMap();

    // Cleanup al desmontar
    return () => {
      cleanupMap();
    };
  }, []);

  // Función para actualizar la ubicación seleccionada
  const updateLocation = useCallback(
    async (
      lat: number,
      lng: number,
      map: any,
      marker: any,
      address?: string
    ) => {
      try {
        marker.setLatLng([lat, lng]);
        map.panTo([lat, lng]);

        let locationAddress = address;
        if (!locationAddress) {
          // Geocodificación inversa usando Nominatim con timeout
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es&addressdetails=1`,
              { signal: controller.signal }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            locationAddress =
              data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          } catch (error) {
            console.warn("Error en geocodificación inversa:", error);
            locationAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          }
        }

        const locationData: LocationData = {
          lat,
          lng,
          address: locationAddress,
          timestamp: new Date().toISOString(),
        };

        setSelectedLocation(locationData);
        toast({
          title: "Ubicación seleccionada",
          description: `${locationAddress}`,
        });
      } catch (error) {
        console.error("Error actualizando ubicación:", error);
        toast({
          title: "Error",
          description: "No se pudo actualizar la ubicación.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // Obtener ubicación actual del usuario
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "La geolocalización no está soportada en este navegador.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        if (map && marker) {
          map.setView([lat, lng], 15);
          updateLocation(lat, lng, map, marker);
        }
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        let errorMessage = "No se pudo obtener tu ubicación actual.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permisos de geolocalización denegados.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Información de ubicación no disponible.";
            break;
          case error.TIMEOUT:
            errorMessage =
              "Tiempo de espera agotado para obtener la ubicación.";
            break;
        }

        toast({
          title: "Error de geolocalización",
          description: errorMessage,
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Buscar ubicaciones usando Nominatim con manejo de errores
  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&accept-language=es&addressdetails=1&countrycodes=es,mx,ar,co,pe,cl,ve,ec,bo,py,uy`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);

      if (data.length === 0) {
        toast({
          title: "No encontrado",
          description: "No se encontraron resultados para la búsqueda.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);

      let errorMessage = "No se pudo realizar la búsqueda.";
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorMessage = "La búsqueda tardó demasiado tiempo.";
        } else if (error.message.includes("HTTP")) {
          errorMessage = "Error del servidor de búsqueda.";
        }
      }

      toast({
        title: "Error de búsqueda",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Seleccionar resultado de búsqueda
  const selectSearchResult = (result: SearchResult) => {
    try {
      const lat = Number.parseFloat(result.lat);
      const lng = Number.parseFloat(result.lon);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Coordenadas inválidas");
      }

      if (map && marker) {
        map.setView([lat, lng], 15);
        updateLocation(lat, lng, map, marker, result.display_name);
      }
      setSearchResults([]);
      setSearchQuery("");
    } catch (error) {
      console.error("Error seleccionando resultado:", error);
      toast({
        title: "Error",
        description: "No se pudo seleccionar la ubicación.",
        variant: "destructive",
      });
    }
  };

  // Cambiar capa del mapa
  const changeMapLayer = (layerType: string) => {
    try {
      setMapLayer(layerType);
      if (window.changeMapLayer) {
        window.changeMapLayer(layerType);
      }
    } catch (error) {
      console.error("Error cambiando capa:", error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el tipo de mapa.",
        variant: "destructive",
      });
    }
  };

  // Guardar ubicación actual
  const saveCurrentLocation = () => {
    if (!selectedLocation) {
      toast({
        title: "Error",
        description: "No hay ninguna ubicación seleccionada para guardar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newSavedLocations = [...savedLocations, selectedLocation];
      setSavedLocations(newSavedLocations);
      localStorage.setItem("savedLocations", JSON.stringify(newSavedLocations));

      toast({
        title: "Ubicación guardada",
        description: "La ubicación se ha guardado correctamente.",
      });
    } catch (error) {
      console.error("Error guardando ubicación:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la ubicación.",
        variant: "destructive",
      });
    }
  };

  // Cargar ubicación guardada
  const loadSavedLocation = (location: LocationData) => {
    try {
      if (map && marker) {
        map.setView([location.lat, location.lng], 15);
        updateLocation(
          location.lat,
          location.lng,
          map,
          marker,
          location.address
        );
      }
    } catch (error) {
      console.error("Error cargando ubicación guardada:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la ubicación guardada.",
        variant: "destructive",
      });
    }
  };

  // Eliminar ubicación guardada
  const deleteSavedLocation = (index: number) => {
    try {
      const newSavedLocations = savedLocations.filter((_, i) => i !== index);
      setSavedLocations(newSavedLocations);
      localStorage.setItem("savedLocations", JSON.stringify(newSavedLocations));

      toast({
        title: "Ubicación eliminada",
        description: "La ubicación se ha eliminado de la lista.",
      });
    } catch (error) {
      console.error("Error eliminando ubicación:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la ubicación.",
        variant: "destructive",
      });
    }
  };

  // Renderizar estado de error
  if (mapError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            {mapError.type === "network" && <WifiOff className="h-4 w-4" />}
            Error cargando el mapa
          </AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{mapError.message}</p>
            {mapError.details && (
              <p className="text-sm opacity-75">{mapError.details}</p>
            )}
            <div className="flex gap-2 mt-3">
              <Button
                onClick={retryMapInitialization}
                size="sm"
                disabled={!isOnline}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar {retryCount > 0 && `(${retryCount}/3)`}
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
              >
                Recargar página
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {/* Diagnóstico del error */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Diagnóstico del Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Estado de conexión:</span>
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? (
                  <Wifi className="h-3 w-3 mr-1" />
                ) : (
                  <WifiOff className="h-3 w-3 mr-1" />
                )}
                {isOnline ? "Conectado" : "Sin conexión"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Tipo de error:</span>
              <Badge variant="outline">{mapError.type}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Reintentos:</span>
              <Badge variant="outline">{retryCount}/3</Badge>
            </div>
            <div className="flex justify-between">
              <span>Timestamp:</span>
              <span className="text-xs text-gray-500">
                {new Date(mapError.timestamp).toLocaleString("es-ES")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderizar estado de carga

  return (
    <div className="space-y-6">
      {/* Indicador de estado de conexión */}
      {!isOnline && (
        <Alert>
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Sin conexión</AlertTitle>
          <AlertDescription>
            Algunas funciones pueden no estar disponibles. El mapa funcionará
            con datos en caché.
          </AlertDescription>
        </Alert>
      )}

      {/* Controles de búsqueda y configuración */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2 space-y-2">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Buscar dirección o lugar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchLocation()}
              className="flex-1"
              disabled={!isOnline}
            />
            <Button
              onClick={searchLocation}
              disabled={isSearching || !isOnline}
              size="icon"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Resultados de búsqueda */}
          {searchResults.length > 0 && (
            <div className="bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((result) => (
                <div
                  key={result.place_id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => selectSearchResult(result)}
                >
                  <p className="font-medium text-sm">{result.display_name}</p>
                  <p className="text-xs text-gray-500">{result.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Select value={mapLayer} onValueChange={changeMapLayer}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de mapa" />
          </SelectTrigger>
          <SelectContent className="z-[999]">
            <SelectItem value="osm">OpenStreetMap</SelectItem>
            <SelectItem value="satellite">Satélite</SelectItem>
            <SelectItem value="topo">Topográfico</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={getCurrentLocation}
          className="w-full"
          disabled={!isOnline}
        >
          <Navigation className="h-4 w-4 mr-2" />
          Mi Ubicación
        </Button>
      </div>

      {/* Mapa */}
      <div className="relative">
        {/* Contenedor SIEMPRE presente */}
        <div className="relative z-0">
          <div
            ref={mapRef}
            className="w-full h-96 md:h-[500px] rounded-lg border-2 border-gray-200 shadow-lg"
          />
        </div>
        {/* Overlay de carga */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-2" />
            <p className="text-gray-600 text-sm">Cargando mapa...</p>
          </div>
        )}

        {selectedLocation && !isLoading && (
          <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg">
            <Button onClick={saveCurrentLocation} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </div>
        )}
      </div>

      {/* Información de ubicación seleccionada */}
      {selectedLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ubicación Seleccionada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Dirección:</strong> {selectedLocation.address}
            </p>
            <p>
              <strong>Coordenadas:</strong> {selectedLocation.lat.toFixed(6)},{" "}
              {selectedLocation.lng.toFixed(6)}
            </p>
            <p>
              <strong>Seleccionada:</strong>{" "}
              {new Date(selectedLocation.timestamp).toLocaleString("es-ES")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Ubicaciones guardadas */}
      {savedLocations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ubicaciones Guardadas</CardTitle>
            <CardDescription>
              Haz clic en una ubicación para cargarla en el mapa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedLocations.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => loadSavedLocation(location)}
                >
                  <div className="flex-1">
                    <p className="font-medium">{location.address}</p>
                    <p className="text-sm text-gray-500">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {new Date(location.timestamp).toLocaleDateString("es-ES")}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSavedLocation(index);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
