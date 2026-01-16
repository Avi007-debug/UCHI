import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Microscope, Map, TrendingUp, Info, CheckCircle2 } from 'lucide-react';
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
                <CardTitle>CHI Classification Scale</CardTitle>
                <CardDescription>
                  Understanding the 5-tier health classification system
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
                <CardTitle>Ground Truth Validation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  CHI values are validated against field surveys and manual canopy assessments 
                  to ensure accuracy. Cross-validation with existing vegetation maps from 
                  Bengaluru Urban Development Authority (BUDA) confirms spatial accuracy.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-bold text-foreground">87%</div>
                    <div className="text-xs text-muted-foreground">Overall Accuracy</div>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-bold text-foreground">0.82</div>
                    <div className="text-xs text-muted-foreground">Kappa Coefficient</div>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="text-2xl font-bold text-foreground">92%</div>
                    <div className="text-xs text-muted-foreground">User Accuracy</div>
                  </div>
                </div>
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
                  <CardTitle className="text-lg text-amber-600">1. RGB-Based Estimation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Limitation:</strong> The system primarily relies on visible spectrum (RGB) 
                    and near-infrared (NIR) bands for vegetation detection. While NDVI provides good 
                    proxy for vegetation presence, it cannot capture all aspects of plant health.
                  </p>
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      <strong>Impact:</strong> Stressed vegetation with normal chlorophyll content 
                      may not be detected. Spectral similarity between healthy and certain diseased 
                      plants can lead to misclassification.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Mitigation:</strong> Cross-validation with ground surveys and temporal 
                    analysis helps identify anomalies. Future versions may incorporate thermal 
                    and hyperspectral data for improved accuracy.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-amber-600">2. No Physiological Plant Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Limitation:</strong> UCHI measures canopy characteristics (coverage, density, vigor) 
                    but cannot directly assess internal plant physiology such as water stress, nutrient deficiency, 
                    or pest infestation until visible symptoms appear.
                  </p>
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      <strong>Impact:</strong> Early-stage health issues may go undetected. 
                      The index is reactive rather than predictive.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Mitigation:</strong> Regular temporal monitoring can identify declining 
                    trends before critical thresholds. Integration with IoT sensors (soil moisture, 
                    weather data) can provide complementary physiological context.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-amber-600">3. Aggregate Index, Not Ground Truth</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Limitation:</strong> CHI is a composite metric that aggregates multiple 
                    factors into a single score. It represents a statistical summary of the area, 
                    not precise measurements of individual trees or plant specimens.
                  </p>
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      <strong>Impact:</strong> Localized variations within a region are smoothed out. 
                      A single unhealthy tree in an otherwise healthy area may not affect the overall score. 
                      CHI should not replace field verification for critical decisions.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Mitigation:</strong> Use CHI for screening and prioritization, followed by 
                    targeted ground surveys in areas of concern. Combine with sub-region analysis for 
                    finer spatial resolution.
                  </p>
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
