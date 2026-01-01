import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RVCERegionResult } from '@/types/uchi';

interface CHIBarChartProps {
  data: RVCERegionResult[];
  title?: string;
  description?: string;
}

const getBarColor = (chi: number): string => {
  if (chi >= 75) return 'hsl(142, 70%, 40%)';
  if (chi >= 60) return 'hsl(142, 50%, 50%)';
  if (chi >= 45) return 'hsl(45, 80%, 50%)';
  if (chi >= 30) return 'hsl(25, 80%, 50%)';
  return 'hsl(0, 70%, 50%)';
};

const CHIBarChart = ({ 
  data, 
  title = 'Regional CHI Comparison', 
  description = 'Canopy Health Index values across different regions'
}: CHIBarChartProps) => {
  const chartData = data.map(item => ({
    name: item.region,
    chi: item.chiValue,
    status: item.status,
  }));

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="font-display text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 10%, 88%)" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: 'hsl(150, 5%, 45%)' }}
                axisLine={{ stroke: 'hsl(140, 10%, 88%)' }}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: 'hsl(150, 5%, 45%)' }}
                axisLine={{ stroke: 'hsl(140, 10%, 88%)' }}
                label={{ 
                  value: 'CHI Value', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'hsl(150, 5%, 45%)', fontSize: 12 }
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(140, 10%, 88%)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px hsl(150 10% 15% / 0.05)',
                }}
                formatter={(value: number, name: string) => [value, 'CHI']}
                labelFormatter={(label) => `Region: ${label}`}
              />
              <Bar 
                dataKey="chi" 
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.chi)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CHIBarChart;
