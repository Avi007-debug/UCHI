import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TreeDeciduous, TreePine, Info } from 'lucide-react';
import { AREA_THRESHOLDS, getCHIColor } from '@/lib/chiUtils';

interface ColorBandProps {
  chi: number;
  areaType: 'city' | 'campus' | 'park';
  label: string;
  range: string;
}

const ColorBand = ({ chi, areaType, label, range }: ColorBandProps) => {
  const color = getCHIColor(chi, areaType);
  
  return (
    <div className="flex items-center gap-3">
      <div 
        className="w-8 h-8 rounded-md border border-gray-300 shadow-sm"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">CHI {range}</div>
      </div>
    </div>
  );
};

export const ColorSchemeGuide = () => {
  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Area-Aware Color Scheme
        </CardTitle>
        <CardDescription>
          Context-sensitive thresholds for accurate vegetation health assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {/* City Thresholds */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">City (Bengaluru)</h3>
            </div>
            <div className="space-y-3">
              <ColorBand 
                chi={10} 
                areaType="city" 
                label="🔴 Critical/Poor" 
                range="< 20"
              />
              <ColorBand 
                chi={27} 
                areaType="city" 
                label="🟠 Poor/Moderate" 
                range="20-35"
              />
              <ColorBand 
                chi={40} 
                areaType="city" 
                label="🟡 Moderate/Good" 
                range="> 35"
              />
            </div>
            <p className="text-xs text-muted-foreground italic mt-3">
              Lower baseline due to urban density constraints
            </p>
          </div>

          {/* Campus Thresholds */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <TreeDeciduous className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Campus (RVCE)</h3>
            </div>
            <div className="space-y-3">
              <ColorBand 
                chi={15} 
                areaType="campus" 
                label="🔴 Critical/Poor" 
                range="< 25"
              />
              <ColorBand 
                chi={32} 
                areaType="campus" 
                label="🟠 Poor/Moderate" 
                range="25-40"
              />
              <ColorBand 
                chi={45} 
                areaType="campus" 
                label="🟡 Moderate/Good" 
                range="> 40"
              />
            </div>
            <p className="text-xs text-muted-foreground italic mt-3">
              Moderate baseline for managed green spaces
            </p>
          </div>

          {/* Park Thresholds */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <TreePine className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Park (Cubbon)</h3>
            </div>
            <div className="space-y-3">
              <ColorBand 
                chi={20} 
                areaType="park" 
                label="🔴 Poor" 
                range="< 30"
              />
              <ColorBand 
                chi={33} 
                areaType="park" 
                label="🟠 Moderate" 
                range="30-36"
              />
              <ColorBand 
                chi={40} 
                areaType="park" 
                label="🟢 Good" 
                range="36-45"
              />
              <ColorBand 
                chi={55} 
                areaType="park" 
                label="🟢 Excellent" 
                range="> 45"
              />
            </div>
            <p className="text-xs text-muted-foreground italic mt-3">
              Higher baseline - parks should be green
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Why area-aware?</strong> Different locations have different vegetation expectations. 
                A CHI of 30 is "Good" for a dense city but "Poor" for a park that should have abundant greenery.
              </p>
              <p>
                <strong className="text-foreground">Smooth gradients:</strong> Colors blend seamlessly between thresholds 
                (e.g., CHI 37.86 shows light green, not harsh yellow/green boundary).
              </p>
              <p>
                <strong className="text-foreground">Scientific basis:</strong> Urban ecology research shows land-use type 
                significantly affects baseline vegetation indices. Context-sensitive thresholds provide accurate assessment.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
