import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, Building2, TreeDeciduous, RefreshCw, Loader2, TreePine } from 'lucide-react';
import CHIDisplay from '@/components/chi/CHIDisplay';
import { ColorSchemeGuide } from '@/components/chi/ColorSchemeGuide';
import { getBengaluruCHI, getRVCECHI, getCubbonCHI, getCHIInterpretation } from '@/services/api';
import { getCHIColor } from '@/lib/chiUtils';
import type { CHIStatus } from '@/types/uchi';

interface AreaData {
  chi: number;
  category: CHIStatus;
  interpretation: string;
  areaType: string;
}

const Results = () => {
  const [bengaluruData, setBengaluruData] = useState<AreaData | null>(null);
  const [rvceData, setRvceData] = useState<AreaData | null>(null);
  const [cubbonData, setCubbonData] = useState<AreaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [blrData, rvceData, cubbonData] = await Promise.all([
        getBengaluruCHI(),
        getRVCECHI(),
        getCubbonCHI(),
      ]);
      setBengaluruData(blrData);
      setRvceData(rvceData);
      setCubbonData(cubbonData);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <BarChart3 className="h-4 w-4" />
              Analysis Results
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              CHI Results Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              View and compare vegetation health indices across all analyzed regions
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Bengaluru Summary */}
          {bengaluruData && (
            <Card className="gradient-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Bengaluru
                </CardTitle>
                <CardDescription>City-wide (25.0 CHI)</CardDescription>
              </CardHeader>
              <CardContent>
                <CHIDisplay 
                  value={bengaluruData.chi} 
                  status={bengaluruData.category}
                  size="lg"
                />
                <p className="text-sm text-muted-foreground mt-4">
                  {bengaluruData.interpretation.substring(0, 100)}...
                </p>
              </CardContent>
            </Card>
          )}

          {/* RVCE Summary */}
          {rvceData && (
            <Card className="gradient-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreeDeciduous className="h-5 w-5 text-primary" />
                  RVCE Campus
                </CardTitle>
                <CardDescription>52-acre campus (22.32 CHI)</CardDescription>
              </CardHeader>
              <CardContent>
                <CHIDisplay 
                  value={rvceData.chi} 
                  status={rvceData.category}
                  size="lg"
                />
                <p className="text-sm text-muted-foreground mt-4">
                  {rvceData.interpretation.substring(0, 100)}...
                </p>
              </CardContent>
            </Card>
          )}

          {/* Cubbon Park Summary */}
          {cubbonData && (
            <Card className="gradient-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-primary" />
                  Cubbon Park
                </CardTitle>
                <CardDescription>300-acre park (37.86 CHI)</CardDescription>
              </CardHeader>
              <CardContent>
                <CHIDisplay 
                  value={cubbonData.chi} 
                  status={cubbonData.category}
                  size="lg"
                />
                <p className="text-sm text-muted-foreground mt-4">
                  {cubbonData.interpretation.substring(0, 100)}...
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Comparison Chart */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle>CHI Comparison</CardTitle>
            <CardDescription>Area-aware vegetation health comparison with context-sensitive thresholds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Bengaluru */}
              {bengaluruData && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Bengaluru (City)</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {bengaluruData.chi.toFixed(1)}/100 - {bengaluruData.category}
                    </span>
                  </div>
                  <div className="h-4 bg-secondary rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${bengaluruData.chi}%`,
                        backgroundColor: getCHIColor(bengaluruData.chi, 'city')
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground pl-1">
                    City Baseline: &lt;20 Critical, 20-35 Moderate, &gt;35 Good
                  </p>
                </div>
              )}

              {/* RVCE */}
              {rvceData && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TreeDeciduous className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">RVCE Campus</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {rvceData.chi.toFixed(1)}/100 - {rvceData.category}
                    </span>
                  </div>
                  <div className="h-4 bg-secondary rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${rvceData.chi}%`,
                        backgroundColor: getCHIColor(rvceData.chi, 'campus')
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground pl-1">
                    Campus Baseline: &lt;25 Critical, 25-40 Moderate, &gt;40 Good
                  </p>
                </div>
              )}

              {/* Cubbon Park */}
              {cubbonData && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TreePine className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Cubbon Park</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {cubbonData.chi.toFixed(1)}/100 - {cubbonData.category}
                    </span>
                  </div>
                  <div className="h-4 bg-secondary rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${cubbonData.chi}%`,
                        backgroundColor: getCHIColor(cubbonData.chi, 'park')
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground pl-1">
                    Park Baseline: &lt;30 Poor, 30-36 Moderate, 36-45 Good, &gt;45 Excellent
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Color Scheme Guide */}
        <div className="mt-8">
          <ColorSchemeGuide />
        </div>
      </div>
    </div>
  );
};

export default Results;
