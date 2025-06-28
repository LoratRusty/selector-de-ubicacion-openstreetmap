# 🗺️ Selector de Ubicación - OpenStreetMap

Una aplicación web **100% gratuita** para seleccionar ubicaciones usando OpenStreetMap y Leaflet.js, sin límites de uso ni claves API requeridas.

[![Estado](https://img.shields.io/badge/Estado-Activo-brightgreen)](https://selector-de-ubicacion-openstreetmap.vercel.app/)
[![Tecnología](https://img.shields.io/badge/Tecnología-React%20%7C%20Next.js%20%7C%20TypeScript-orange)](#tecnologías-utilizadas)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)](LICENSE)

## 🚀 Demo en Vivo

[**Ver Demo →**](https://selector-de-ubicacion-openstreetmap.vercel.app/)

---

## 📋 Tabla de Contenidos

- [Características](#-características-principales)
- [Inicio Rápido](#-inicio-rápido)
- [Instalación](#-instalación)
- [Uso](#-uso-básico)
- [Configuración](#-configuración-avanzada)
- [Tecnologías](#-tecnologías-utilizadas)
- [Comparación](#-comparación-con-alternativas)
- [Diagnóstico](#-diagnóstico-y-solución-de-problemas)
- [Despliegue](#-despliegue)
- [Contribuir](#-contribuir)
- [Soporte](#-soporte)

---

## ✨ Características Principales

### 🆓 **Completamente Gratuito**
- Sin costos de API ni límites de uso
- No requiere registro ni configuración externa
- Sin claves API necesarias

### 🗺️ **Mapas Potentes**
- Múltiples capas: OpenStreetMap, Satélite, Topográfico
- Búsqueda global con geocodificación Nominatim
- Selección interactiva: clic, arrastre y geolocalización

### 💾 **Características Avanzadas**
- Almacenamiento local de ubicaciones favoritas
- Diagnóstico integrado con detección automática de problemas
- Sistema completo de manejo de errores
- Interfaz responsive para móvil, tablet y desktop

### 🌐 **Desarrollo Moderno**
- Multiidioma con interfaz en español
- Arquitectura robusta con TypeScript
- Componentes reutilizables con shadcn/ui

---

## 🚀 Inicio Rápido - Clonar Repositorio

```bash
git clone https://github.com/LoratRusty/selector-de-ubicacion-openstreetmap.git
cd selector-de-ubicacion-openstreetmap
npm install
npm run dev
```

**Abre http://localhost:3000** (o en el puerto que tengas configurado)🎉

---

## 📋 Requisitos

- **Node.js** 18.18.0 o superior
- **npm, yarn, pnpm o bun**
- **Navegador moderno** con soporte para ES6+

---

## 🛠️ Instalación

### Desarrollo Local

```bash
# Clonar repositorio
git clone https://github.com/LoratRusty/selector-de-ubicacion-openstreetmap.git
cd selector-ubicacion

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Para producción
npm run build
npm start
```

### 📁 Estructura del Proyecto

```
selector-ubicacion/
├── app/
│   ├── page.tsx                 # Página principal
│   ├── documentacion/page.tsx   # Documentación completa
│   ├── diagnostico/page.tsx     # Herramientas de diagnóstico
│   ├── layout.tsx              # Layout principal
│   └── globals.css             # Estilos globales
├── components/
│   ├── location-selector.tsx   # Componente principal del mapa
│   ├── documentation.tsx       # Componente de documentación
│   ├── map-diagnostics.tsx     # Sistema de diagnóstico
│   └── ui/                     # Componentes de UI (shadcn/ui)
├── hooks/
│   └── use-toast.ts           # Hook para notificaciones
├── lib/
│   └── utils.ts               # Utilidades
└── README.md                  # Este archivo
```

---

## 🎯 Uso Básico

### Componente Standalone

```tsx
import { LocationSelector } from '@/components/location-selector'

function MiApp() {
  const handleLocationSelect = (location) => {
    console.log('Ubicación seleccionada:', location)
    // { lat: 40.4168, lng: -3.7038, address: "Madrid, España", timestamp: "..." }
  }

  return (
    <div>
      <h1>Mi Aplicación</h1>
      <LocationSelector onLocationSelect={handleLocationSelect} />
    </div>
  )
}
```

### Integración con Formularios

```tsx
import { useForm } from 'react-hook-form'
import { LocationSelector } from '@/components/location-selector'

function FormularioUbicacion() {
  const { setValue, register } = useForm()

  const handleLocationSelect = (location) => {
    setValue('latitude', location.lat)
    setValue('longitude', location.lng)
    setValue('address', location.address)
  }

  return (
    <form>
      <LocationSelector onLocationSelect={handleLocationSelect} />
      <input type="hidden" {...register('latitude')} />
      <input type="hidden" {...register('longitude')} />
      <input type="hidden" {...register('address')} />
    </form>
  )
}
```

---

## 🔧 Configuración Avanzada

### Personalización del Componente

```tsx
<LocationSelector
  initialCenter={[40.4168, -3.7038]}
  initialZoom={10}
  enableDiagnostics={true}
  retryAttempts={3}
  searchCountries="es,mx,ar"
  onLocationSelect={handleLocationSelect}
  onError={handleError}
  className="mi-mapa-personalizado"
/>
```

---

## 🌍 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18+ | Framework de UI |
| **Next.js** | 14+ | Framework full-stack |
| **TypeScript** | 5+ | Tipado estático |
| **Tailwind CSS** | 3+ | Estilos utilitarios |
| **Leaflet.js** | 1.9.4 | Biblioteca de mapas |
| **OpenStreetMap** | - | Datos cartográficos |
| **Nominatim** | - | Geocodificación |
| **shadcn/ui** | - | Componentes de UI |
| **Lucide React** | - | Iconos |

---

## 🆚 Comparación con Alternativas

| Característica | Este Proyecto | Google Maps | Mapbox |
|----------------|---------------|-------------|---------|
| **Costo** | ✅ Gratuito | ❌ Límites/Pago | ❌ Límites/Pago |
| **API Key** | ✅ No requerida | ❌ Obligatoria | ❌ Obligatoria |
| **Límites de uso** | ✅ Sin límites | ❌ 28k/mes | ❌ 50k/mes |
| **Privacidad** | ✅ Sin tracking | ⚠️ Google tracking | ⚠️ Tracking |
| **Personalización** | ✅ Código abierto | ⚠️ Limitada | ✅ Buena |
| **Calidad de datos** | 📊 Muy buena | ✅ Excelente | ✅ Excelente |
| **Soporte offline** | ✅ Caché local | ❌ No | ⚠️ Limitado |

---

## 🔍 Diagnóstico y Solución de Problemas

### Herramienta de Diagnóstico Integrada

**Visita `/diagnostico`** para ejecutar pruebas automáticas:

- ✅ **Conectividad de red** - Verifica acceso a OpenStreetMap
- ✅ **Biblioteca Leaflet** - Confirma carga de dependencias
- ✅ **API Nominatim** - Prueba geocodificación
- ✅ **Geolocalización** - Verifica permisos GPS
- ✅ **Almacenamiento** - Confirma LocalStorage

### Problemas Comunes y Soluciones

<details>
<summary>🚨 Error: "Contenedor del mapa no encontrado"</summary>

**Causa:** El componente se renderiza antes que el DOM  
**Solución:** El componente ya incluye manejo automático de este error
</details>

<details>
<summary>🌐 Error: "Sin conexión a internet"</summary>

**Causa:** Problemas de red o firewall  
**Soluciones:**
1. Verificar conexión a internet
2. Comprobar firewall corporativo
3. Usar el botón "Reintentar"
</details>

<details>
<summary>📚 Error: "Leaflet no está disponible"</summary>

**Causa:** CDN bloqueado o caché corrupta  
**Soluciones:**
1. Recargar página (Ctrl+F5)
2. Limpiar caché del navegador
3. Desactivar bloqueadores temporalmente
</details>

<details>
<summary>🔍 Error: "No se encontraron resultados"</summary>

**Causa:** Términos de búsqueda muy específicos  
**Soluciones:**
1. Usar términos más generales
2. Incluir país en la búsqueda
3. Verificar ortografía
</details>

---

## 📊 Rendimiento y Optimizaciones

### Métricas de Carga
- **Leaflet.js**: ~40KB (vs Google Maps ~200KB+)
- **Tiempo de inicialización**: <2 segundos
- **Memoria utilizada**: <50MB
- **Requests de red**: Mínimos (solo tiles necesarios)

### Optimizaciones Incluidas
- ✅ Carga lazy de bibliotecas externas
- ✅ Debounce en búsquedas (500ms)
- ✅ Caché automático de tiles
- ✅ Cleanup de event listeners
- ✅ Timeouts configurables
- ✅ Reintentos con backoff exponencial

---

## 🔒 Seguridad y Privacidad

### Características de Seguridad
- 🛡️ **Sin tracking**: No se envían datos a servicios comerciales
- 🔐 **Validación de entrada**: Sanitización de coordenadas y búsquedas
- 🌐 **HTTPS requerido**: Para geolocalización y funciones avanzadas
- 💾 **Almacenamiento local**: Los datos permanecen en el dispositivo

### Políticas de Uso
- ✅ Respeta términos de OpenStreetMap
- ✅ Implementa rate limiting en búsquedas
- ✅ Uso responsable de recursos
- ✅ Cumple con GDPR (no recopila datos personales)

---

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar dominio personalizado
vercel --prod
```

### Netlify

```bash
# Build del proyecto
npm run build

# Subir carpeta .next a Netlify
# Configurar redirects para Next.js
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Contribuir

### Desarrollo Local

```bash
# Fork del repositorio
git clone https://github.com/LoratRusty/selector-de-ubicacion-openstreetmap.git

cd selector-ubicacion

# Crear rama para feature
git checkout -b feature/nueva-funcionalidad

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar tests
npm run test

# Crear commit
git commit -m "feat: nueva funcionalidad"

# Push y crear PR
git push origin feature/nueva-funcionalidad
```

### Guías de Contribución

1. **Issues**: Reporta bugs o solicita features
2. **Pull Requests**: Sigue las convenciones de commit
3. **Documentación**: Actualiza README y docs
4. **Tests**: Incluye tests para nuevas funcionalidades

---

## 🗺️ Roadmap

### ✅ Versión Actual (v1.0)
- Mapa interactivo básico
- Búsqueda y geocodificación
- Almacenamiento local
- Sistema de diagnóstico
- Manejo robusto de errores

<!-- ### 🚧 Próximas Versiones

#### v1.1 - Mejoras de UX
- 🔄 Modo offline completo
- 🎨 Temas personalizables
- 📱 PWA (Progressive Web App)
- 🌍 Más idiomas

#### v1.2 - Funcionalidades Avanzadas
- 📏 Medición de distancias
- 🗺️ Rutas y direcciones
- 📍 Múltiples marcadores
- 🎯 Geofencing

#### v1.3 - Integración
- 🔌 API REST
- 📊 Analytics opcionales
- 🔗 Webhooks
- 📦 NPM package

--- -->

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2025 José L. De Sousa P.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Agradecimientos

- **[OpenStreetMap](https://www.openstreetmap.org/)** - Por proporcionar datos cartográficos gratuitos
- **[Leaflet.js](https://leafletjs.com/)** - Por la excelente biblioteca de mapas
- **[Nominatim](https://nominatim.org/)** - Por el servicio de geocodificación
- **[shadcn/ui](https://ui.shadcn.com/)** - Por los componentes de UI
- **[Vercel](https://vercel.com/)** - Por el hosting y herramientas de desarrollo

---

## 📞 Soporte

- 📧 **Email**: ing.jds.dev@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/LoratRusty/selector-de-ubicacion-openstreetmap/issues)
- 📖 **Documentación**: [/documentacion](./app/documentacion/page.tsx)
- 🔧 **Diagnóstico**: [/diagnostico](./app/diagnostico/page.tsx)

---

<div align="center">

**¿Te gusta este proyecto?** ⭐ ¡Dale una estrella en GitHub!

**¿Encontraste un bug?** 🐛 [Reporta un issue](https://github.com/LoratRusty/selector-de-ubicacion-openstreetmap/issues)

[**Demo en Vivo**](https://selector-de-ubicacion-openstreetmap.vercel.app/) • [**Documentación**](./app/documentacion/page.tsx) • [**Diagnóstico**](./app/diagnostico/page.tsx)

</div>