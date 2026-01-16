import { AREA_THRESHOLDS, getCHIColor } from '@/lib/chiUtils';

interface AreaAwareLegendProps {
  areaType: 'city' | 'campus' | 'park';
}

export function AreaAwareLegend({ areaType }: AreaAwareLegendProps) {
  const thresholds = AREA_THRESHOLDS[areaType];
  
  const legends = {
    city: [
      { range: '< 20', color: getCHIColor(10, 'city'), label: 'Critical/Poor', emoji: '🔴' },
      { range: '20-35', color: getCHIColor(27, 'city'), label: 'Poor/Moderate', emoji: '🟠' },
      { range: '> 35', color: getCHIColor(40, 'city'), label: 'Moderate', emoji: '🟡' },
    ],
    campus: [
      { range: '< 25', color: getCHIColor(15, 'campus'), label: 'Critical/Poor', emoji: '🔴' },
      { range: '25-40', color: getCHIColor(32, 'campus'), label: 'Poor/Moderate', emoji: '🟠' },
      { range: '> 40', color: getCHIColor(45, 'campus'), label: 'Moderate', emoji: '🟡' },
    ],
    park: [
      { range: '< 30', color: getCHIColor(20, 'park'), label: 'Poor', emoji: '🟠' },
      { range: '30-45', color: getCHIColor(37, 'park'), label: 'Moderate/Good', emoji: '🟡' },
      { range: '> 45', color: getCHIColor(55, 'park'), label: 'Good/Excellent', emoji: '🟢' },
    ],
  };

  const items = legends[areaType];
  const title = {
    city: '🏙️ City Thresholds',
    campus: '🏫 Campus Thresholds',
    park: '🌳 Park Thresholds',
  }[areaType];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="font-semibold text-sm mb-3 text-gray-700">{title}</h3>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-900">
                {item.emoji} CHI {item.range}
              </div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic">
          Area-aware thresholds reflect different baseline expectations for vegetation health.
        </p>
      </div>
    </div>
  );
}
