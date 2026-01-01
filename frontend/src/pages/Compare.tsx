import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { GitCompare, Loader2, RefreshCw } from 'lucide-react';
import TemporalComparisonCard from '@/components/comparison/TemporalComparisonCard';
import { getTemporalComparison } from '@/services/api';
import type { TemporalComparison as TemporalComparisonType, RVCESubRegion } from '@/types/uchi';

const REGIONS = ['Bengaluru', 'Campus', 'Sports Ground', 'Parking', 'Hostel', 'Roadside'];

const Compare = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Campus');
  const [comparison, setComparison] = useState<TemporalComparisonType | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchComparison = async (region: string) => {
    setLoading(true);
    try {
      const data = await getTemporalComparison(region);
      setComparison(data);
    } catch (error) {
      console.error('Failed to fetch comparison:', error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchComparison(selectedRegion);
  }, [selectedRegion]);

  const handleRefresh = () => {
    fetchComparison(selectedRegion);
  };

  return (
    <div className="py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <GitCompare className="h-4 w-4" />
            Temporal Analysis
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Vegetation Health Comparison
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare vegetation health over time to track environmental changes and identify trends
          </p>
        </div>

        {/* Region Selection */}
        <Card className="gradient-card mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Select Region for Comparison</CardTitle>
            <CardDescription>
              Choose a region to compare its latest CHI value with the previous analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Result */}
        {loading && initialLoad ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading comparison data...</p>
            </div>
          </div>
        ) : comparison ? (
          <div className="space-y-6">
            <TemporalComparisonCard comparison={comparison} />

            {/* API Integration Note */}
            <Card className="border-dashed border-2 border-border bg-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  🔧 Backend Integration Point
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p><strong>Current:</strong> Using randomly generated CHI values for demonstration</p>
                <p><strong>API Endpoint:</strong></p>
                <code className="block mt-2 p-2 rounded bg-secondary text-secondary-foreground">
                  GET /compare/{'{region}'} → Returns last two CHI values with change calculation
                </code>
                <p className="mt-3"><strong>Response Format:</strong></p>
                <pre className="mt-2 p-3 rounded bg-secondary text-secondary-foreground overflow-x-auto">
{`{
  "region": "${selectedRegion}",
  "oldCHI": ${comparison.oldCHI},
  "oldDate": "${comparison.oldDate}",
  "newCHI": ${comparison.newCHI},
  "newDate": "${comparison.newDate}",
  "change": ${comparison.change},
  "changePercentage": ${comparison.changePercentage},
  "direction": "${comparison.direction}"
}`}
                </pre>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Quick Region Buttons */}
        <div className="mt-10">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Quick Select</h3>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;
