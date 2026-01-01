import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CHIStatus } from '@/types/uchi';
import CHIDisplay from './CHIDisplay';
import { Leaf, TreeDeciduous, Droplets, Sun } from 'lucide-react';

interface CHICardProps {
  title: string;
  description?: string;
  chiValue: number;
  status: CHIStatus;
  interpretation: string;
  vegetationCoverage?: number;
  healthyVegetation?: number;
  stressedVegetation?: number;
  className?: string;
}

const CHICard = ({
  title,
  description,
  chiValue,
  status,
  interpretation,
  vegetationCoverage,
  healthyVegetation,
  stressedVegetation,
  className,
}: CHICardProps) => {
  return (
    <Card className={cn('gradient-card animate-fade-in', className)}>
      <CardHeader className="text-center pb-2">
        <CardTitle className="font-display text-2xl">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <CHIDisplay value={chiValue} status={status} size="lg" />
        </div>

        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          {interpretation}
        </p>

        {(vegetationCoverage !== undefined || healthyVegetation !== undefined) && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            {vegetationCoverage !== undefined && (
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <TreeDeciduous className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold text-foreground">
                  {vegetationCoverage.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground text-center">
                  Vegetation Coverage
                </span>
              </div>
            )}
            {healthyVegetation !== undefined && (
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-chi-good/10">
                <Leaf className="h-5 w-5 text-chi-good" />
                <span className="text-lg font-semibold text-chi-good">
                  {healthyVegetation.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground text-center">
                  Healthy
                </span>
              </div>
            )}
            {stressedVegetation !== undefined && (
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-chi-moderate/10">
                <Droplets className="h-5 w-5 text-chi-moderate" />
                <span className="text-lg font-semibold text-chi-moderate">
                  {stressedVegetation.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground text-center">
                  Stressed
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CHICard;
