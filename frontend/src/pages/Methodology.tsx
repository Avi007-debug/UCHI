import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Microscope, Map, TrendingUp, Info, CheckCircle2, Building2, TreeDeciduous, TreePine } from 'lucide-react';
import { CHI_LEGEND } from '@/lib/chiUtils';

const Methodology = () => {
  return (
    <div className="py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Microscope className="h-4 w-4" />
            Methodology & About
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How UCHI Works
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Understanding the Urban Canopy Health Index calculation methodology,
            data sources, and interpretation guidelines.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="methodology">Methodology</TabsTrigger>
            <TabsTrigger value="chi-scale">CHI Scale</TabsTrigger>
            <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
            <TabsTrigger value="limitations">Limitations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  What is UCHI?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The <strong>Urban Canopy Health Index (UCHI)</strong> is a quantitative metric 
                  that assesses vegetation health in urban environments. It combines remote sensing data, 
                  computer vision techniques, and ecological indicators to produce a standardized 
                  score ranging from 0 to 100.
                </p>
                <p className="text-muted-foreground">
                  This system provides real-time visualization of precomputed CHI values for 
                  Bengaluru city and RV College of Engineering campus, enabling stakeholders 
                  to monitor urban green space health and make data-driven decisions for 
                  environmental management.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Study Areas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Bengaluru (Macro Level)</h4>
                    <p className="text-sm text-muted-foreground">
                      City-wide analysis covering approximately 741 km² of urban area, 
                      including major green corridors, parks, and tree canopy.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">RVCE Campus (Micro Level)</h4>
                    <p className="text-sm text-muted-foreground">
                      Detailed campus-level assessment including academic zones, 
                      sports grounds, parking areas, and hostel blocks.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Multi-scale spatial analysis (city to campus)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Color-coded visualization for quick assessment</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Standardized 0-100 scale for easy comparison</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Rule-based CV approach for consistent results</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Methodology Tab */}
          <TabsContent value="methodology" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>4-Step Processing Pipeline</CardTitle>
                <CardDescription>
                  How satellite imagery is transformed into actionable vegetation health insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      step: '01',
                      title: 'Data Collection',
                      icon: Database,
                      description: 'High-resolution satellite imagery is acquired from remote sensing platforms. Images are selected based on cloud cover, resolution, and temporal consistency.',
                      details: ['Satellite: Landsat 8/9, Sentinel-2', 'Resolution: 10-30m', 'Spectral bands: RGB + NIR']
                    },
                    {
                      step: '02',
                      title: 'Image Preprocessing',
                      icon: Microscope,
                      description: 'Raw imagery undergoes radiometric correction, atmospheric correction, and geometric normalization to ensure consistent analysis.',
                      details: ['Atmospheric correction applied', 'Cloud masking performed', 'Image enhancement for clarity']
                    },
                    {
                      step: '03',
                      title: 'Vegetation Detection',
                      icon: Map,
                      description: 'Rule-based computer vision algorithms segment vegetation from non-vegetation using spectral indices (NDVI, EVI) and classification techniques.',
                      details: ['NDVI threshold-based segmentation', 'Morphological filtering', 'Canopy density calculation']
                    },
                    {
                      step: '04',
                      title: 'CHI Calculation',
                      icon: TrendingUp,
                      description: 'Health metrics are aggregated into a single 0-100 score based on canopy coverage, vegetation vigor, and spatial distribution.',
                      details: ['Coverage weight: 40%', 'Vigor weight: 35%', 'Distribution weight: 25%']
                    }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.step} className="flex gap-4 border-l-2 border-primary pl-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-primary">STEP {item.step}</span>
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {item.details.map((detail, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-primary/50"></span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">CV Approach: Rule-Based</h4>
                    <p className="text-sm text-muted-foreground">
                      This system uses a <strong>rule-based computer vision approach</strong> rather than deep learning. 
                      Vegetation is detected using spectral indices (NDVI = (NIR - Red) / (NIR + Red)) with empirically 
                      determined thresholds. This approach ensures interpretability, requires no training data, 
                      and provides consistent results across different imagery conditions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CHI Scale Tab */}
          <TabsContent value="chi-scale" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CHI Calculation Formula</CardTitle>
                <CardDescription>
                  The weighted formula used to compute the Canopy Health Index
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-lg bg-secondary/50 border-2 border-primary/20">
                  <div className="text-center mb-4">
                    <code className="text-lg font-mono font-semibold text-foreground">
                      CHI = (Coverage × 0.7) + (Greenness × 0.3)
                    </code>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-foreground min-w-[140px]">Coverage (70%):</span>
                      <span className="text-muted-foreground">Percentage of image area with green vegetation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-foreground min-w-[140px]">Greenness (30%):</span>
                      <span className="text-muted-foreground">Quality metric based on HSV saturation/value</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      <strong>Why 70/30 weights?</strong> Coverage is prioritized because urban planning focuses on total canopy extent. 
                      This weighting provides the best correlation with expert visual assessment of urban vegetation health.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Area-Specific Scales */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* City Scale */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    City Scale
                  </CardTitle>
                  <CardDescription>e.g., Bengaluru</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#ef4444' }}>
                      <div className="font-semibold text-white text-sm">Poor (&lt; 20)</div>
                      <div className="text-xs text-white/90">Severe vegetation deficit</div>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#f97316' }}>
                      <div className="font-semibold text-white text-sm">Moderate (20-35)</div>
                      <div className="text-xs text-white/90">Limited but acceptable</div>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#22c55e' }}>
                      <div className="font-semibold text-white text-sm">Good (&gt; 35)</div>
                      <div className="text-xs text-white/90">Healthy for urban context</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Lower thresholds due to high urban density and building coverage.
                  </p>
                </CardContent>
              </Card>

              {/* Campus Scale */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TreeDeciduous className="h-5 w-5" />
                    Campus Scale
                  </CardTitle>
                  <CardDescription>e.g., RVCE</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#ef4444' }}>
                      <div className="font-semibold text-white text-sm">Critical/Poor (&lt; 25)</div>
                      <div className="text-xs text-white/90">Needs intervention</div>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#f97316' }}>
                      <div className="font-semibold text-white text-sm">Moderate (25-40)</div>
                      <div className="text-xs text-white/90">Room for improvement</div>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#22c55e' }}>
                      <div className="font-semibold text-white text-sm">Good (&gt; 40)</div>
                      <div className="text-xs text-white/90">Well-maintained green space</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Moderate expectations for educational campuses with mixed use.
                  </p>
                </CardContent>
              </Card>

              {/* Park Scale */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TreePine className="h-5 w-5" />
                    Park Scale
                  </CardTitle>
                  <CardDescription>e.g., Cubbon Park</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#f97316' }}>
                      <div className="font-semibold text-white text-sm">Poor (&lt; 30)</div>
                      <div className="text-xs text-white/90">Below park standards</div>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#eab308' }}>
                      <div className="font-semibold text-white text-sm">Good (30-45)</div>
                      <div className="text-xs text-white/90">Adequate park vegetation</div>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#22c55e' }}>
                      <div className="font-semibold text-white text-sm">Excellent (&gt; 45)</div>
                      <div className="text-xs text-white/90">Exceptional park health</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Higher expectations for dedicated green spaces and conservation areas.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Why Area-Aware Scales?</h4>
                    <p className="text-sm text-muted-foreground">
                      Parks should have more vegetation than dense cities. The same CHI score (e.g., 30) means different things: 
                      "Good" for a city with high building density, but "Poor" for a park dedicated to green space. 
                      Context-sensitive thresholds reflect urban ecology expectations and enable fair comparisons.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>General CHI Classification</CardTitle>
                <CardDescription>
                  Standard 5-tier health classification system (not area-specific)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {CHI_LEGEND.map((item) => (
                    <div key={item.status} className="flex items-center gap-4 p-4 rounded-lg border">
                      <div 
                        className="w-16 h-16 rounded-lg border-2 border-gray-800 flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-foreground">{item.status}</h3>
                          <span className="text-sm text-muted-foreground">CHI: {item.range}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interpretation Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-1">For Urban Planners</h4>
                  <p className="text-sm text-muted-foreground">
                    CHI values below 45 indicate areas requiring immediate intervention through 
                    tree planting initiatives, irrigation improvements, or pest management.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">For Environmental Scientists</h4>
                  <p className="text-sm text-muted-foreground">
                    Temporal trends in CHI can reveal seasonal patterns, drought impacts, 
                    or the effectiveness of conservation programs.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">For Campus Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Sub-region analysis helps prioritize maintenance resources and identify 
                    zones needing enhanced green infrastructure.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Sources Tab */}
          <TabsContent value="data-sources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Satellite Data Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="font-semibold text-foreground mb-1">Landsat 8/9 (USGS)</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      30m resolution multispectral imagery with 16-day revisit time. 
                      Provides consistent long-term data for temporal analysis.
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• Spatial Resolution: 30m (multispectral)</div>
                      <div>• Temporal Resolution: 16 days</div>
                      <div>• Spectral Bands: 11 (including NIR)</div>
                    </div>
                  </div>

                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="font-semibold text-foreground mb-1">Sentinel-2 (ESA)</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      10m resolution with high spectral fidelity. Excellent for detailed 
                      vegetation analysis at campus level.
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• Spatial Resolution: 10m (RGB + NIR)</div>
                      <div>• Temporal Resolution: 5 days</div>
                      <div>• Spectral Bands: 13</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reference Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  CHI values are computed using rule-based computer vision (HSV color segmentation) 
                  and validated through visual inspection of vegetation masks overlaid on original RGB images. 
                  Expected CHI ranges align with urban ecology literature benchmarks for dense cities (10-30%), 
                  green campuses (30-50%), and urban parks (60-80%).
                </p>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Data Update Frequency</h4>
                    <p className="text-sm text-muted-foreground">
                      CHI values are computed offline using batch processing pipelines. 
                      The dashboard displays the most recent precomputed values. 
                      For production deployment, automated updates can be scheduled weekly or monthly 
                      depending on satellite data availability.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Limitations Tab */}
          <TabsContent value="limitations" className="space-y-6">
            <Card className="border-amber-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-amber-500" />
                  Limitations & Scope
                </CardTitle>
                <CardDescription>
                  Understanding the constraints and boundaries of this methodology
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  While UCHI provides valuable insights into urban vegetation health, it is important 
                  to acknowledge the inherent limitations of remote sensing-based approaches. 
                  This transparency ensures appropriate interpretation and application of results.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-amber-600">1. RGB-Based Estimation (Not Physiological Health)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Limitation:</strong> Detection relies solely on visible green color in RGB images. 
                    Cannot detect plant stress, disease, or drought conditions. No differentiation between 
                    healthy vs. stressed vegetation.
                  </p>
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      <strong>Implication:</strong> CHI measures visual greenness, not botanical health. 
                      Early-stage plant stress may go undetected until visible symptoms appear.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-amber-600">2. No Ground-Truth Validation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Limitation:</strong> System has not been validated against field measurements. 
                    No comparison with professional vegetation surveys. Thresholds (HSV: 25-95) are 
                    empirically determined, not calibrated.
                  </p>
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      <strong>Implication:</strong> CHI scores are relative indicators, not absolute metrics. 
                      Suitable for comparative analysis and trend monitoring, not precision measurements.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-amber-600">3. Aggregate Index (Not Pixel-Accurate Diagnosis)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Limitation:</strong> Provides area-wide average, not precise spatial mapping. 
                    Cannot identify individual trees or vegetation types. No species differentiation 
                    (grass vs. trees vs. shrubs).
                  </p>
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      <strong>Implication:</strong> Useful for macro-level monitoring, not detailed ecology studies. 
                      Localized variations are smoothed out in the aggregate score.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-amber-600">4. Seasonal Dependence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Limitation:</strong> Dry season images show lower CHI (leaves shed, grass turns brown). 
                    Monsoon images show higher CHI (lush vegetation). No seasonal normalization applied.
                  </p>
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      <strong>Implication:</strong> Temporal comparisons must account for seasonality. 
                      Year-over-year trends are more meaningful than absolute values.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-amber-600">4. Additional Constraints</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></span>
                      <div>
                        <strong>Cloud Cover:</strong> Optical satellite imagery is affected by cloud 
                        cover. Data gaps may occur during monsoon seasons.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></span>
                      <div>
                        <strong>Spatial Resolution:</strong> 10-30m resolution may miss small features 
                        like individual shrubs or newly planted saplings.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></span>
                      <div>
                        <strong>Shadow Effects:</strong> Tall buildings and structures can cast shadows 
                        that affect vegetation detection in urban environments.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></span>
                      <div>
                        <strong>Species-Specific Characteristics:</strong> Different tree species have 
                        varying spectral signatures. CHI may not capture species-level health variations.
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-lg text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Suitable For
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-muted-foreground">Urban vegetation trend monitoring (monthly/seasonal)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-muted-foreground">Comparative analysis between locations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-muted-foreground">Policy impact assessment (before/after interventions)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-muted-foreground">Educational demonstrations of remote sensing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-lg text-red-600 flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    NOT Suitable For
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span className="text-muted-foreground">Medical diagnosis of plant diseases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span className="text-muted-foreground">Precision agriculture (needs multispectral imaging)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span className="text-muted-foreground">Legal boundary disputes (needs surveyed accuracy)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span className="text-muted-foreground">Species identification (needs higher resolution + AI)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-green-50 dark:bg-green-950/20 border-green-500/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Why Transparency Increases Credibility</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Explicitly stating limitations demonstrates scientific rigor and professional maturity. 
                      It shows awareness of methodological boundaries and prevents overinterpretation of results.
                    </p>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      Best Practice: Use UCHI as a screening and monitoring tool, not as a replacement 
                      for on-ground ecological assessment. Combine remote sensing with field verification 
                      for comprehensive vegetation management.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Methodology;
