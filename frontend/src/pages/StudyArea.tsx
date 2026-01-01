import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, TreeDeciduous, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import CHIDisplay from '@/components/chi/CHIDisplay';
import RegionTable from '@/components/tables/RegionTable';
import CHIBarChart from '@/components/charts/CHIBarChart';
import { getBangaloreSummary, getRVCEResults } from '@/services/api';
import type { BangaloreSummary, RVCERegionResult } from '@/types/uchi';

const StudyArea = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('type') === 'rvce' ? 'rvce' : 'bengaluru';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [bangaloreSummary, setBangaloreSummary] = useState<BangaloreSummary | null>(null);
  const [rvceResults, setRvceResults] = useState<RVCERegionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [blrData, rvceData] = await Promise.all([
          getBangaloreSummary(),
          getRVCEResults(),
        ]);
        setBangaloreSummary(blrData);
        setRvceResults(rvceData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading study area data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <MapPin className="h-4 w-4" />
            Study Areas
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Select Your Analysis Region
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose between macro-level city analysis or micro-level campus assessment
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 h-14 mb-8">
            <TabsTrigger value="bengaluru" className="flex items-center gap-2 text-base">
              <Building2 className="h-5 w-5" />
              <span className="hidden sm:inline">Bengaluru</span>
              <span className="sm:hidden">Blr</span>
              <span className="text-xs text-muted-foreground">(Macro)</span>
            </TabsTrigger>
            <TabsTrigger value="rvce" className="flex items-center gap-2 text-base">
              <TreeDeciduous className="h-5 w-5" />
              <span>RVCE</span>
              <span className="text-xs text-muted-foreground">(Micro)</span>
            </TabsTrigger>
          </TabsList>

          {/* Bengaluru Tab */}
          <TabsContent value="bengaluru" className="animate-fade-in">
            {bangaloreSummary && (
              <div className="space-y-8">
                <Card className="gradient-card">
                  <CardHeader className="text-center">
                    <CardTitle className="font-display text-2xl">Bengaluru Overall Analysis</CardTitle>
                    <CardDescription>
                      Macro-level vegetation health assessment for the city of Bengaluru
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex justify-center">
                      <CHIDisplay
                        value={bangaloreSummary.overallCHI}
                        status={bangaloreSummary.status}
                        size="lg"
                        showTrend
                        trendDirection={bangaloreSummary.trendDirection}
                        trendPercentage={bangaloreSummary.trendPercentage}
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-secondary/50 text-center">
                        <span className="text-2xl font-bold text-foreground">
                          {bangaloreSummary.totalAnalyses}
                        </span>
                        <p className="text-sm text-muted-foreground">Total Analyses</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/50 text-center">
                        <span className="text-2xl font-bold text-foreground">55-70</span>
                        <p className="text-sm text-muted-foreground">CHI Range</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/50 text-center">
                        <span className="text-2xl font-bold text-foreground">
                          {new Date(bangaloreSummary.lastUpdated).toLocaleDateString()}
                        </span>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                      <h3 className="font-semibold text-foreground mb-2">About Bengaluru Analysis</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        The macro-level analysis covers Bengaluru's major green corridors, parks, 
                        and urban forests. The CHI value represents the average vegetation health 
                        across monitored zones, helping identify city-wide environmental trends 
                        and informing urban planning decisions.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Button variant="nature" size="lg" asChild>
                    <Link to="/upload?area=bengaluru">
                      Upload Bengaluru Image
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* RVCE Tab */}
          <TabsContent value="rvce" className="animate-fade-in">
            <div className="space-y-8">
              <Card className="gradient-card">
                <CardHeader className="text-center">
                  <CardTitle className="font-display text-2xl">RVCE Campus Analysis</CardTitle>
                  <CardDescription>
                    Micro-level vegetation health assessment for RV College of Engineering
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 rounded-xl bg-accent/5 border border-accent/20 mb-6">
                    <h3 className="font-semibold text-foreground mb-2">Sub-Regions Analyzed</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The RVCE campus analysis covers five distinct zones: Campus Core (academic buildings 
                      and surrounding greenery), Sports Ground, Parking Areas, Hostel/Residential zones, 
                      and Roadside vegetation. Each zone has distinct vegetation characteristics.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-5 mb-8">
                    {rvceResults.map((result) => (
                      <div 
                        key={result.region}
                        className="p-4 rounded-xl bg-secondary/30 text-center hover:bg-secondary/50 transition-colors"
                      >
                        <CHIDisplay 
                          value={result.chiValue} 
                          status={result.status} 
                          size="sm" 
                        />
                        <p className="text-xs text-muted-foreground mt-2">{result.region}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <RegionTable data={rvceResults} />

              <CHIBarChart 
                data={rvceResults}
                title="RVCE Regional CHI Comparison"
                description="Visual comparison of vegetation health across campus zones"
              />

              <div className="flex justify-center">
                <Button variant="nature" size="lg" asChild>
                  <Link to="/upload?area=rvce">
                    Upload RVCE Image
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudyArea;
