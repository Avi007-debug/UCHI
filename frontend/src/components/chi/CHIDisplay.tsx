import { cn } from '@/lib/utils';
import type { CHIStatus } from '@/types/uchi';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CHIDisplayProps {
  value: number;
  status: CHIStatus;
  size?: 'sm' | 'md' | 'lg';
  showTrend?: boolean;
  trendDirection?: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  animate?: boolean;
}

const statusColors: Record<CHIStatus, string> = {
  Excellent: 'chi-excellent',
  Good: 'chi-good',
  Moderate: 'chi-moderate',
  Poor: 'chi-poor',
  Critical: 'chi-critical',
};

const statusBgColors: Record<CHIStatus, string> = {
  Excellent: 'bg-chi-excellent/10 border-chi-excellent/30',
  Good: 'bg-chi-good/10 border-chi-good/30',
  Moderate: 'bg-chi-moderate/10 border-chi-moderate/30',
  Poor: 'bg-chi-poor/10 border-chi-poor/30',
  Critical: 'bg-chi-critical/10 border-chi-critical/30',
};

const sizeClasses = {
  sm: {
    container: 'w-20 h-20',
    value: 'text-2xl',
    label: 'text-xs',
  },
  md: {
    container: 'w-32 h-32',
    value: 'text-4xl',
    label: 'text-sm',
  },
  lg: {
    container: 'w-48 h-48',
    value: 'text-6xl',
    label: 'text-base',
  },
};

const CHIDisplay = ({
  value,
  status,
  size = 'md',
  showTrend = false,
  trendDirection,
  trendPercentage,
  animate = true,
}: CHIDisplayProps) => {
  const classes = sizeClasses[size];

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={cn(
          'relative flex flex-col items-center justify-center rounded-full border-2',
          classes.container,
          statusBgColors[status],
          animate && 'animate-scale-in'
        )}
      >
        <span className={cn('font-display font-bold', classes.value, statusColors[status])}>
          {value}
        </span>
        <span className={cn('font-medium text-muted-foreground', classes.label)}>
          CHI
        </span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className={cn('font-semibold', statusColors[status])}>
          {status}
        </span>

        {showTrend && trendDirection && (
          <div className="flex items-center gap-1 text-sm">
            {trendDirection === 'up' && (
              <>
                <TrendingUp className="h-4 w-4 text-chi-good" />
                <span className="text-chi-good">+{trendPercentage}%</span>
              </>
            )}
            {trendDirection === 'down' && (
              <>
                <TrendingDown className="h-4 w-4 text-chi-poor" />
                <span className="text-chi-poor">-{Math.abs(trendPercentage || 0)}%</span>
              </>
            )}
            {trendDirection === 'stable' && (
              <>
                <Minus className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Stable</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CHIDisplay;
