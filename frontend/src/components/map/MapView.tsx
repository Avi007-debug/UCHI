import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { AreaType } from '@/types/uchi';
import { getCHIColor } from '@/lib/chiUtils';

interface MapViewProps {
  areaType: AreaType;
  bengaluruCHI: number;
  rvceCHI: number;
}

const MapView = ({ 
  areaType, 
  bengaluruCHI, 
  rvceCHI,
}: MapViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bangaloreGeo, setBangaloreGeo] = useState<any>(null);
  const [rvceGeo, setRvceGeo] = useState<any>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Load GeoJSON files
  useEffect(() => {
    console.log('Loading GeoJSON files...');
    
    fetch("/geojson/bangalore.geojson")
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load bangalore.geojson: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        console.log('Bangalore GeoJSON loaded:', data);
        // Extract the first feature if it's a FeatureCollection
        setBangaloreGeo(data.type === 'FeatureCollection' ? data.features[0] : data);
      })
      .catch(err => {
        console.error("Failed to load Bangalore GeoJSON:", err);
        setGeoError(err.message);
      });

    fetch("/geojson/rvce.geojson")
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load rvce.geojson: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        console.log('RVCE GeoJSON loaded:', data);
        // Extract the first feature if it's a FeatureCollection
        setRvceGeo(data.type === 'FeatureCollection' ? data.features[0] : data);
      })
      .catch(err => {
        console.error("Failed to load RVCE GeoJSON:", err);
        setGeoError(err.message);
      });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (!bangaloreGeo || !rvceGeo) {
      console.log('Waiting for GeoJSON data...');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('Rendering map for area:', areaType);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Helper function to convert lat/lng to canvas coordinates
    const latLngToCanvas = (coords: number[][], bounds: any) => {
      const { minLat, maxLat, minLng, maxLng } = bounds;
      const latRange = maxLat - minLat;
      const lngRange = maxLng - minLng;
      
      return coords.map(([lng, lat]) => {
        const x = ((lng - minLng) / lngRange) * (width - 100) + 50;
        const y = height - 50 - ((lat - minLat) / latRange) * (height - 100);
        return [x, y];
      });
    };

    // Calculate bounds from GeoJSON
    const getBounds = (coordinates: number[][][]) => {
      const allCoords = coordinates[0];
      const lngs = allCoords.map(c => c[0]);
      const lats = allCoords.map(c => c[1]);
      return {
        minLng: Math.min(...lngs),
        maxLng: Math.max(...lngs),
        minLat: Math.min(...lats),
        maxLat: Math.max(...lats),
      };
    };

    if (areaType === 'Bengaluru') {
      // Get Bengaluru coordinates and bounds
      const blrCoords = bangaloreGeo.geometry.coordinates;
      const blrBounds = getBounds(blrCoords);
      
      // Draw Bengaluru polygon
      const bengaluruColor = getCHIColor(bengaluruCHI);
      const canvasCoords = latLngToCanvas(blrCoords[0], blrBounds);
      
      ctx.fillStyle = bengaluruColor;
      ctx.beginPath();
      ctx.moveTo(canvasCoords[0][0], canvasCoords[0][1]);
      canvasCoords.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw RVCE as highlighted sub-region (force green color)
      const rvceCoords = rvceGeo.geometry.coordinates;
      
      // Map RVCE coords to Bengaluru bounds
      const rvceCanvasCoords = latLngToCanvas(rvceCoords[0], blrBounds);
      
      // Calculate center and scale up RVCE for better visibility
      const rvceCenterX = rvceCanvasCoords.reduce((sum, c) => sum + c[0], 0) / rvceCanvasCoords.length;
      const rvceCenterY = rvceCanvasCoords.reduce((sum, c) => sum + c[1], 0) / rvceCanvasCoords.length;
      
      // Scale factor to make RVCE more visible (4x larger)
      const scaleFactor = 4;
      const scaledRvceCoords = rvceCanvasCoords.map(([x, y]) => [
        rvceCenterX + (x - rvceCenterX) * scaleFactor,
        rvceCenterY + (y - rvceCenterY) * scaleFactor
      ]);
      
      // Fill RVCE with green color
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(scaledRvceCoords[0][0], scaledRvceCoords[0][1]);
      scaledRvceCoords.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.closePath();
      ctx.fill();
      
      // Add a bright border for emphasis
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Inter, system-ui, sans-serif';
      ctx.fillText('Bengaluru', 70, 80);
      
      // RVCE label with background
      ctx.fillStyle = '#fff';
      ctx.fillRect(rvceCenterX - 30, rvceCenterY - 22, 60, 24);
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.strokeRect(rvceCenterX - 30, rvceCenterY - 22, 60, 24);
      
      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 14px Inter, system-ui, sans-serif';
      ctx.fillText('RVCE', rvceCenterX - 20, rvceCenterY - 5);

      // Legend
      ctx.fillStyle = '#000';
      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.fillText(`Bengaluru CHI: ${bengaluruCHI.toFixed(1)}`, 70, height - 70);
      ctx.fillText(`RVCE CHI: ${rvceCHI.toFixed(1)}`, 70, height - 50);

    } else {
      // RVCE campus view - zoomed in
      const rvceCoords = rvceGeo.geometry.coordinates;
      const rvceBounds = getBounds(rvceCoords);
      
      const canvasCoords = latLngToCanvas(rvceCoords[0], rvceBounds);

      // Force green color for RVCE
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(canvasCoords[0][0], canvasCoords[0][1]);
      canvasCoords.slice(1).forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 24px Inter, system-ui, sans-serif';
      ctx.fillText('RVCE Campus', 70, 70);

      // Add descriptive text
      ctx.fillStyle = '#000';
      ctx.font = '14px Inter, system-ui, sans-serif';
      ctx.fillText(`Campus Health Index: ${rvceCHI.toFixed(1)}`, 70, 100);
      ctx.fillText('Entire campus vegetation coverage shown', 70, 120);
    }

    // Color legend
    const legendY = height - 25;
    const legendItems = [
      { color: '#22c55e', label: '≥75: Excellent' },
      { color: '#eab308', label: '50-75: Good' },
      { color: '#f97316', label: '25-50: Moderate' },
      { color: '#ef4444', label: '<25: Poor' },
    ];

    let legendX = 70;
    legendItems.forEach(item => {
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, legendY - 10, 15, 15);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.strokeRect(legendX, legendY - 10, 15, 15);
      
      ctx.fillStyle = '#000';
      ctx.font = '10px Inter, system-ui, sans-serif';
      ctx.fillText(item.label, legendX + 20, legendY);
      legendX += 150;
    });

  }, [areaType, bengaluruCHI, rvceCHI, bangaloreGeo, rvceGeo]);

  return (
    <Card className="p-4">
      {geoError ? (
        <div className="w-full h-[500px] flex items-center justify-center border rounded-lg bg-muted">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-destructive">Failed to load map data</p>
            <p className="text-xs text-muted-foreground">{geoError}</p>
          </div>
        </div>
      ) : !bangaloreGeo || !rvceGeo ? (
        <div className="w-full h-[500px] flex items-center justify-center border rounded-lg bg-muted">
          <div className="text-center space-y-2">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="w-full h-[500px] rounded-lg border"
          style={{ width: '100%', height: '500px' }}
        />
      )}
    </Card>
  );
};

export default MapView;
