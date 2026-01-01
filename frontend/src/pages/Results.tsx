import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, Building2, TreeDeciduous, RefreshCw, Loader2 } from 'lucide-react';
import CHIDisplay from '@/components/chi/CHIDisplay';
import RegionTable from '@/components/tables/RegionTable';
import CHIBarChart from '@/components/charts/CHIBarChart';
import { getBangaloreSummary, getRVCEResults, getResults, getCHIInterpretation } from '@/services/api';
import type { BangaloreSummary, RVCERegionResult, CHIResult } from '@/types/uchi';

const Results = () => {
  const [bangaloreSummary, setBangaloreSummary] = useState<BangaloreSummary | null>(null);
  const [rvceResults, setRvceResults] = useState<RVCERegionResult[]>([]);
  const [allResults, setAllResults] = useState<CHIResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [blrData, rvceData, allData] = await Promise.all([
        getBangaloreSummary(),
        getRVCEResults(),
        getResults(),
      ]);
      setBangaloreSummary(blrData);
      setRvceResults(rvceData);
      setAllResults(allData);
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
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Bengaluru Summary */}
          {bangaloreSummary && (
            <Card className="gradient-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Bengaluru Overview
                </CardTitle>
                <CardDescription>City-wide vegetation health summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <CHIDisplay 
                    value={bangaloreSummary.overallCHI} 
                    status={bangaloreSummary.status}
                    size="md"
                    showTrend
                    trendDirection={bangaloreSummary.trendDirection}
                    trendPercentage={bangaloreSummary.trendPercentage}
                  />
                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {getCHIInterpretation(bangaloreSummary.status).substring(0, 120)}...
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Analyses: <span className="text-foreground font-medium">{bangaloreSummary.totalAnalyses}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* RVCE Summary */}
          <Card className="gradient-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreeDeciduous className="h-5 w-5 text-primary" />
                RVCE Overview
              </CardTitle>
              <CardDescription>Campus vegetation health summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {rvceResults.map((result) => (
                  <div key={result.region} className="text-center">
                    <CHIDisplay 
                      value={result.chiValue} 
                      status={result.status}
                      size="sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {result.region}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <Tabs defaultValue="rvce" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rvce" className="flex items-center gap-2">
              <TreeDeciduous className="h-4 w-4" />
              RVCE Detailed
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              All Analyses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rvce" className="space-y-6 animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-6">
              <RegionTable data={rvceResults} />
              <CHIBarChart data={rvceResults} />
            </div>
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle>Analysis History</CardTitle>
                <CardDescription>All vegetation health analyses performed</CardDescription>
              </CardHeader>
              <CardContent>
                {allResults.length > 0 ? (
                  <div className="space-y-4">
                    {allResults.slice(0, 10).map((result, index) => (
                      <div 
                        key={result.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <CHIDisplay 
                            value={result.chiValue} 
                            status={result.status} 
                            size="sm" 
                            animate={false}
                          />
                          <div>
                            <p className="font-medium text-foreground">
                              {result.subRegion || result.areaType}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {result.date}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {result.areaType}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No analyses found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Results;
