import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, TreeDeciduous, Loader2, Info } from 'lucide-react';
import MapView from '@/components/map/MapView';
import InteractiveMap from '@/components/map/InteractiveMap';
import CHIDisplay from '@/components/chi/CHIDisplay';
import { DataExportButton } from '@/components/DataExportButton';
import * as api from '@/services/api';
import type { AreaType, CHIStatus } from '@/types/uchi';
import { CHI_LEGEND } from '@/lib/chiUtils';

interface CHIData {
  chi: number;
  category: CHIStatus;
  interpretation: string;
  areaType: string;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<AreaType>('Bengaluru');
  const [bengaluruData, setBengaluruData] = useState<CHIData | null>(null);
  const [rvceData, setRvceData] = useState<CHIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching CHI data from backend...');
        console.log('API functions available:', {
          getBengaluruCHI: typeof api.getBengaluruCHI,
          getRVCECHI: typeof api.getRVCECHI
        });
        
        if (typeof api.getBengaluruCHI !== 'function' || typeof api.getRVCECHI !== 'function') {
          throw new Error('API functions not properly loaded. Please refresh the page.');
        }
        
        const [blrCHI, rvceCHI] = await Promise.all([
          api.getBengaluruCHI(),
          api.getRVCECHI(),
        ]);
        
        console.log('Bengaluru CHI:', blrCHI);
        console.log('RVCE CHI:', rvceCHI);
        
        setBengaluruData(blrCHI);
        setRvceData(rvceCHI);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error instanceof Error ? error.message : 'Failed to connect to backend. Please ensure the Flask server is running on http://localhost:5000');
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
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-2xl mx-auto border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Connection Error</CardTitle>
            <CardDescription>Unable to fetch data from backend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-semibold text-sm">Quick Fix:</p>
              <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                <li>Open a terminal in <code className="bg-background px-1">C:\Coding\UCHI\backend</code></li>
                <li>Run: <code className="bg-background px-2">python app.py</code></li>
                <li>Verify backend starts on <code className="bg-background px-1">http://localhost:5000</code></li>
                <li>Refresh this page</li>
              </ol>
            </div>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentData = activeTab === 'Bengaluru' ? bengaluruData : rvceData;

  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <TreeDeciduous className="h-4 w-4" />
            Urban Canopy Health Index Dashboard
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Vegetation Health Visualization
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
            Real-time monitoring of urban canopy health across Bengaluru city and RVCE campus
          </p>
          <div className="flex justify-center">
            <DataExportButton />
          </div>
        </div>

        {/* Region Toggle */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AreaType)} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 h-14 mb-8">
            <TabsTrigger value="Bengaluru" className="flex items-center gap-2 text-base">
              <Building2 className="h-5 w-5" />
              <span>Bengaluru</span>
              <span className="text-xs text-muted-foreground">(City Overview)</span>
            </TabsTrigger>
            <TabsTrigger value="RVCE" className="flex items-center gap-2 text-base">
              <TreeDeciduous className="h-5 w-5" />
              <span>RVCE</span>
              <span className="text-xs text-muted-foreground">(Campus Overview)</span>
            </TabsTrigger>
          </TabsList>

          {/* Bengaluru View */}
          <TabsContent value="Bengaluru" className="animate-fade-in space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Interactive Map */}
              <div className="md:col-span-2">
                <InteractiveMap
                  areaType="Bengaluru"
                  bengaluruCHI={bengaluruData?.chi || 0}
                  rvceCHI={rvceData?.chi || 0}
                />
              </div>

              {/* CHI Information Panel */}
              <div className="space-y-4">
                <Card className="gradient-card">
                  <CardHeader>
                    <CardTitle className="text-xl">Bengaluru CHI</CardTitle>
                    <CardDescription>City-wide vegetation health</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-center">
                      <CHIDisplay
                        value={bengaluruData?.chi || 0}
                        status={bengaluruData?.category || 'Moderate'}
                        size="lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Info className="h-4 w-4" />
                        <span>Health Category</span>
                      </div>
                      <p className="text-lg font-semibold text-primary">
                        {bengaluruData?.category}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Interpretation</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {bengaluruData?.interpretation}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">RVCE Highlighted</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      RVCE campus is highlighted on the map with its own CHI value ({rvceData?.chi.toFixed(1)}).
                      Click the RVCE tab to zoom into campus details.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* RVCE View */}
          <TabsContent value="RVCE" className="animate-fade-in space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Interactive Map */}
              <div className="md:col-span-2">
                <InteractiveMap
                  areaType="RVCE"
                  bengaluruCHI={bengaluruData?.chi || 0}
                  rvceCHI={rvceData?.chi || 0}
                />
              </div>

              {/* CHI Information Panel */}
              <div className="space-y-4">
                <Card className="gradient-card">
                  <CardHeader>
                    <CardTitle className="text-xl">RVCE Campus CHI</CardTitle>
                    <CardDescription>Campus-level vegetation health</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-center">
                      <CHIDisplay
                        value={rvceData?.chi || 0}
                        status={rvceData?.category || 'Moderate'}
                        size="lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Info className="h-4 w-4" />
                        <span>Health Category</span>
                      </div>
                      <p className="text-lg font-semibold text-primary">
                        {rvceData?.category}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Interpretation</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {rvceData?.interpretation}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Campus Sub-regions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      The map shows different campus zones including:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Sports Ground</li>
                      <li>Campus Buildings</li>
                      <li>Parking Areas</li>
                      <li>Hostel Blocks</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Color Legend Card */}
        <Card className="max-w-6xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-lg">CHI Color Scale</CardTitle>
            <CardDescription>Understanding vegetation health indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {CHI_LEGEND.map((item) => (
                <div key={item.status} className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded border-2 border-gray-800"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div>
                    <div className="font-medium text-sm">{item.status}</div>
                    <div className="text-xs text-muted-foreground">{item.range}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
