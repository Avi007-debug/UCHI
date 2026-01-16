import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AreaType } from '@/types/uchi';
import { getCHIColor } from '@/lib/chiUtils';

// Leaflet types
declare global {
  interface Window {
    L: any;
  }
}

interface InteractiveMapProps {
  areaType: AreaType;
  bengaluruCHI: number;
  rvceCHI: number;
  cubbonCHI?: number;
}

const InteractiveMap = ({ 
  areaType, 
  bengaluruCHI, 
  rvceCHI,
  cubbonCHI = 0,
}: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [bangaloreGeo, setBangaloreGeo] = useState<any>(null);
  const [rvceGeo, setRvceGeo] = useState<any>(null);
  const [cubbonGeo, setCubbonGeo] = useState<any>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Load Leaflet library
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.L) {
      // Load Leaflet CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);

      // Load Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => {
        console.log('Leaflet loaded');
        setLeafletLoaded(true);
      };
      document.head.appendChild(script);
    } else if (window.L) {
      setLeafletLoaded(true);
    }
  }, []);

  // Load GeoJSON files
  useEffect(() => {
    console.log('Loading GeoJSON files...');
    
    Promise.all([
      fetch("/geojson/bangalore.geojson").then(res => {
        if (!res.ok) throw new Error(`Failed to load bangalore.geojson: ${res.statusText}`);
        return res.json();
      }),
      fetch("/geojson/rvce.geojson").then(res => {
        if (!res.ok) throw new Error(`Failed to load rvce.geojson: ${res.statusText}`);
        return res.json();
      }),
      fetch("/geojson/cubbon.geojson").then(res => {
        if (!res.ok) throw new Error(`Failed to load cubbon.geojson: ${res.statusText}`);
        return res.json();
      })
    ])
    .then(([blrData, rvceData, cubbonData]) => {
      console.log('Bangalore GeoJSON loaded:', blrData);
      console.log('RVCE GeoJSON loaded:', rvceData);
      console.log('Cubbon GeoJSON loaded:', cubbonData);
      setBangaloreGeo(blrData.type === 'FeatureCollection' ? blrData.features[0] : blrData);
      setRvceGeo(rvceData.type === 'FeatureCollection' ? rvceData.features[0] : rvceData);
      setCubbonGeo(cubbonData.type === 'FeatureCollection' ? cubbonData.features[0] : cubbonData);
      setIsLoading(false);
    })
    .catch(err => {
      console.error("Failed to load GeoJSON:", err);
      setGeoError(err.message);
      setIsLoading(false);
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || !bangaloreGeo || !rvceGeo || !cubbonGeo || isLoading) {
      return;
    }

    const L = window.L;

    // Destroy existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Create map
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: true,
    });

    mapInstanceRef.current = map;

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add custom zoom control
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    // Style function for areas with area-aware colors
    const bengaluruStyle = {
      fillColor: getCHIColor(bengaluruCHI, 'city'),
      fillOpacity: 0.5,
      color: '#000',
      weight: 2,
    };

    const rvceStyle = {
      fillColor: getCHIColor(rvceCHI, 'campus'),
      fillOpacity: 0.7,
      color: '#16a34a',
      weight: 3,
    };

    const cubbonStyle = {
      fillColor: getCHIColor(cubbonCHI, 'park'),
      fillOpacity: 0.7,
      color: '#059669',
      weight: 3,
    };

    // Add Bengaluru polygon
    const bengaluruLayer = L.geoJSON(bangaloreGeo, {
      style: bengaluruStyle,
      onEachFeature: (feature: any, layer: any) => {
        layer.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg">Bengaluru City</h3>
            <p class="text-sm mt-1">CHI Score: <span class="font-semibold">${bengaluruCHI.toFixed(1)}</span></p>
            <p class="text-sm">Status: <span class="font-semibold">${getCHIStatus(bengaluruCHI)}</span></p>
          </div>
        `);
      }
    }).addTo(map);

    // Add RVCE polygon (shown on Bengaluru view as micro-region)
    const rvceLayer = L.geoJSON(rvceGeo, {
      style: rvceStyle,
      onEachFeature: (feature: any, layer: any) => {
        layer.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg">RVCE Campus</h3>
            <p class="text-sm mt-1">CHI Score: <span class="font-semibold">${rvceCHI.toFixed(1)}</span></p>
            <p class="text-sm">Status: <span class="font-semibold">${getCHIStatus(rvceCHI)}</span></p>
            <p class="text-xs text-gray-500 mt-1">Micro-region within Bengaluru</p>
          </div>
        `);
      }
    }).addTo(map);

    // Add Cubbon Park polygon (shown on Bengaluru view as micro-region)
    const cubbonLayer = L.geoJSON(cubbonGeo, {
      style: cubbonStyle,
      onEachFeature: (feature: any, layer: any) => {
        layer.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg">Cubbon Park</h3>
            <p class="text-sm mt-1">CHI Score: <span class="font-semibold">${cubbonCHI > 0 ? cubbonCHI.toFixed(1) : 'Processing...'}</span></p>
            <p class="text-sm">Status: <span class="font-semibold">${cubbonCHI > 0 ? getCHIStatus(cubbonCHI) : 'Pending'}</span></p>
            <p class="text-xs text-gray-500 mt-1">300-acre urban lung space</p>
          </div>
        `);
      }
    }).addTo(map);

    // Set view based on area type
    if (areaType === 'Bengaluru') {
      map.fitBounds(bengaluruLayer.getBounds(), { padding: [50, 50] });
    } else if (areaType === 'RVCE') {
      map.fitBounds(rvceLayer.getBounds(), { padding: [50, 50], maxZoom: 16 });
    } else if (areaType === 'Cubbon Park') {
      map.fitBounds(cubbonLayer.getBounds(), { padding: [50, 50], maxZoom: 16 });
    }

    // Add legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.style.boxShadow = '0 0 15px rgba(0,0,0,0.2)';

      const grades = [0, 25, 50, 75];
      const labels = ['Critical', 'Poor', 'Moderate', 'Good', 'Excellent'];
      const colors = ['#dc2626', '#ef4444', '#f97316', '#eab308', '#22c55e'];

      div.innerHTML = '<div style="font-weight: bold; margin-bottom: 5px;">CHI Legend</div>';

      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<div style="margin-bottom: 3px;">' +
          '<i style="background:' + colors[i] + '; width: 18px; height: 18px; display: inline-block; margin-right: 5px; border: 1px solid #000;"></i> ' +
          '<span style="font-size: 12px;">' + labels[i] + ' (' + grades[i] + (grades[i + 1] ? '-' + grades[i + 1] : '+') + ')</span>' +
          '</div>';
      }

      return div;
    };
    legend.addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded, bangaloreGeo, rvceGeo, cubbonGeo, areaType, bengaluruCHI, rvceCHI, cubbonCHI, isLoading]);

  const getCHIStatus = (chi: number): string => {
    if (chi >= 75) return 'Excellent';
    if (chi >= 50) return 'Good';
    if (chi >= 25) return 'Moderate';
    if (chi >= 10) return 'Poor';
    return 'Critical';
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleFitBounds = () => {
    if (mapInstanceRef.current && bangaloreGeo && rvceGeo) {
      const L = window.L;
      const layer = areaType === 'Bengaluru' 
        ? L.geoJSON(bangaloreGeo)
        : L.geoJSON(rvceGeo);
      mapInstanceRef.current.fitBounds(layer.getBounds(), { padding: [50, 50] });
    }
  };

  if (geoError) {
    return (
      <Card className="p-4">
        <div className="w-full h-[500px] flex items-center justify-center border rounded-lg bg-muted">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-destructive">Failed to load map data</p>
            <p className="text-xs text-muted-foreground">{geoError}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (isLoading || !leafletLoaded) {
    return (
      <Card className="p-4">
        <div className="w-full h-[500px] flex items-center justify-center border rounded-lg bg-muted">
          <div className="text-center space-y-2">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Loading interactive map...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 relative">
      {/* Map container */}
      <div 
        ref={mapRef} 
        className="w-full h-[500px] rounded-lg border"
        style={{ zIndex: 0 }}
      />
      
      {/* Custom controls */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomIn}
          className="shadow-md"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomOut}
          className="shadow-md"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleFitBounds}
          className="shadow-md"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Info box */}
      <div className="absolute top-6 right-6 z-[1000] bg-white p-3 rounded-lg shadow-md border max-w-xs">
        <h3 className="font-bold text-sm mb-1">
          {areaType === 'Bengaluru' ? 'Bengaluru City' : 'RVCE Campus'}
        </h3>
        <p className="text-xs text-muted-foreground">
          Click on areas for detailed CHI information. Use mouse wheel to zoom, drag to pan.
        </p>
      </div>
    </Card>
  );
};

export default InteractiveMap;
