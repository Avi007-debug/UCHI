import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
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

  // Load GeoJSON files
  useEffect(() => {
    fetch("/geojson/bangalore.geojson")
      .then(res => res.json())
      .then(setBangaloreGeo)
      .catch(err => console.error("Failed to load Bangalore GeoJSON:", err));

    fetch("/geojson/rvce.geojson")
      .then(res => res.json())
      .then(setRvceGeo)
      .catch(err => console.error("Failed to load RVCE GeoJSON:", err));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bangaloreGeo || !rvceGeo) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    if (areaType === 'Bengaluru') {
      // Draw Bengaluru city boundary
      const bengaluruColor = getCHIColor(bengaluruCHI);
      const rvceColor = getCHIColor(rvceCHI);

      // Bengaluru rectangle (full map)
      ctx.fillStyle = bengaluruColor;
      ctx.fillRect(50, 50, width - 100, height - 100);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, width - 100, height - 100);

      // RVCE rectangle (highlighted sub-region in top-right)
      const rvceX = width - 200;
      const rvceY = 80;
      const rvceWidth = 100;
      const rvceHeight = 80;

      ctx.fillStyle = rvceColor;
      ctx.fillRect(rvceX, rvceY, rvceWidth, rvceHeight);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeRect(rvceX, rvceY, rvceWidth, rvceHeight);

      // Labels
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Inter, system-ui, sans-serif';
      ctx.fillText('Bengaluru', 70, 80);
      
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px Inter, system-ui, sans-serif';
      ctx.fillText('RVCE', rvceX + 25, rvceY + 45);

      // Legend
      ctx.fillStyle = '#000';
      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.fillText(`Bengaluru CHI: ${bengaluruCHI.toFixed(1)}`, 70, height - 70);
      ctx.fillText(`RVCE CHI: ${rvceCHI.toFixed(1)}`, 70, height - 50);

    } else {
      // Draw RVCE campus only (zoomed in)
      const rvceColor = getCHIColor(rvceCHI);

      ctx.fillStyle = rvceColor;
      ctx.fillRect(50, 50, width - 100, height - 100);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeRect(50, 50, width - 100, height - 100);

      // Label
      ctx.fillStyle = '#000';
      ctx.font = 'bold 20px Inter, system-ui, sans-serif';
      ctx.fillText('RVCE Campus', 70, 80);

      // Sub-regions (simplified visualization)
      const subRegions = [
        { name: 'Sports Ground', x: 70, y: 120, w: 150, h: 100 },
        { name: 'Campus Buildings', x: 240, y: 120, w: 200, h: 150 },
        { name: 'Parking', x: 70, y: 240, w: 100, h: 80 },
        { name: 'Hostel', x: 190, y: 290, w: 120, h: 90 },
      ];

      subRegions.forEach(region => {
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(region.x, region.y, region.w, region.h);
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#333';
        ctx.font = '10px Inter, system-ui, sans-serif';
        ctx.fillText(region.name, region.x + 5, region.y + 15);
      });

      // Legend
      ctx.fillStyle = '#000';
      ctx.font = '14px Inter, system-ui, sans-serif';
      ctx.fillText(`RVCE Campus CHI: ${rvceCHI.toFixed(1)}`, 70, height - 50);
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
      <canvas
        ref={canvasRef}
        className="w-full h-[500px] rounded-lg border"
        style={{ width: '100%', height: '500px' }}
      />
    </Card>
  );
};

export default MapView;
