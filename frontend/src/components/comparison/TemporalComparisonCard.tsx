import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TemporalComparison } from '@/types/uchi';
import { getCHIStatus } from '@/services/api';

interface TemporalComparisonCardProps {
  comparison: TemporalComparison;
}

const TemporalComparisonCard = ({ comparison }: TemporalComparisonCardProps) => {
  const { region, oldCHI, oldDate, newCHI, newDate, change, changePercentage, direction } = comparison;

  const oldStatus = getCHIStatus(oldCHI);
  const newStatus = getCHIStatus(newCHI);

  const getTrendColor = () => {
    if (direction === 'increase') return 'text-chi-good bg-chi-good/10';
    if (direction === 'decrease') return 'text-chi-poor bg-chi-poor/10';
    return 'text-muted-foreground bg-muted';
  };

  const getTrendIcon = () => {
    if (direction === 'increase') return TrendingUp;
    if (direction === 'decrease') return TrendingDown;
    return Minus;
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className="gradient-card animate-fade-in">
      <CardHeader>
        <CardTitle className="font-display text-xl">{region}</CardTitle>
        <CardDescription>Temporal vegetation health comparison</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* CHI Values Comparison */}
        <div className="flex items-center justify-between gap-4">
          {/* Old CHI */}
          <div className="flex-1 text-center p-4 rounded-xl bg-secondary/50">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span>{oldDate}</span>
            </div>
            <span className="text-4xl font-display font-bold text-foreground">
              {oldCHI}
            </span>
            <p className="text-sm text-muted-foreground mt-1">{oldStatus}</p>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-1">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* New CHI */}
          <div className="flex-1 text-center p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span>{newDate}</span>
            </div>
            <span className="text-4xl font-display font-bold text-primary">
              {newCHI}
            </span>
            <p className="text-sm text-primary/80 mt-1">{newStatus}</p>
          </div>
        </div>

        {/* Change Indicator */}
        <div className={cn(
          'flex items-center justify-center gap-3 p-4 rounded-xl',
          getTrendColor()
        )}>
          <TrendIcon className="h-6 w-6" />
          <div className="text-center">
            <span className="text-2xl font-bold">
              {direction === 'increase' ? '+' : direction === 'decrease' ? '' : ''}{change}
            </span>
            <span className="text-lg ml-1">
              ({changePercentage > 0 ? '+' : ''}{changePercentage}%)
            </span>
          </div>
        </div>

        {/* Interpretation */}
        <p className="text-sm text-muted-foreground text-center">
          {direction === 'increase' 
            ? 'Vegetation health has improved. The canopy shows positive growth patterns and increased chlorophyll activity.'
            : direction === 'decrease'
            ? 'Vegetation health has declined. Consider investigating potential stress factors such as water availability or disease.'
            : 'Vegetation health remains stable. Continue monitoring for any emerging changes.'}
        </p>
      </CardContent>
    </Card>
  );
};

export default TemporalComparisonCard;
