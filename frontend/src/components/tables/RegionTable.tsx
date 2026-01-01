import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { RVCERegionResult, CHIStatus } from '@/types/uchi';
import { MapPin, Calendar, Activity } from 'lucide-react';

interface RegionTableProps {
  data: RVCERegionResult[];
  title?: string;
  description?: string;
}

const getStatusVariant = (status: CHIStatus): string => {
  const variants: Record<CHIStatus, string> = {
    Excellent: 'bg-chi-excellent/10 text-chi-excellent border-chi-excellent/30',
    Good: 'bg-chi-good/10 text-chi-good border-chi-good/30',
    Moderate: 'bg-chi-moderate/10 text-chi-moderate border-chi-moderate/30',
    Poor: 'bg-chi-poor/10 text-chi-poor border-chi-poor/30',
    Critical: 'bg-chi-critical/10 text-chi-critical border-chi-critical/30',
  };
  return variants[status];
};

const RegionTable = ({
  data,
  title = 'RVCE Regional Analysis',
  description = 'Detailed CHI values for each sub-region within RVCE campus',
}: RegionTableProps) => {
  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="font-display text-xl flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Region
                  </div>
                </TableHead>
                <TableHead className="text-center font-semibold">CHI Value</TableHead>
                <TableHead className="text-center font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">
                  <div className="flex items-center justify-end gap-2">
                    <Calendar className="h-4 w-4" />
                    Last Analyzed
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow 
                  key={row.region}
                  className={cn(
                    'transition-colors',
                    index % 2 === 0 ? 'bg-card' : 'bg-secondary/20'
                  )}
                >
                  <TableCell className="font-medium">{row.region}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-lg font-semibold">{row.chiValue}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn('border', getStatusVariant(row.status))}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {row.lastAnalyzed}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionTable;
