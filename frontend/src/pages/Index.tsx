import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  Building2, 
  ArrowRight, 
  TreeDeciduous, 
  BarChart3, 
  Upload, 
  GitCompare,
  CheckCircle2
} from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'Image Upload',
    description: 'Upload satellite or aerial imagery for instant vegetation analysis',
  },
  {
    icon: BarChart3,
    title: 'CHI Calculation',
    description: 'Advanced algorithms compute Canopy Health Index from spectral data',
  },
  {
    icon: GitCompare,
    title: 'Temporal Analysis',
    description: 'Compare vegetation health over time to track environmental changes',
  },
];

const studyAreas = [
  {
    icon: Building2,
    name: 'Bengaluru',
    type: 'Macro Level',
    description: 'City-wide vegetation health assessment covering major green corridors and urban forests',
    chiRange: '55-70',
    link: '/study-area?type=bengaluru',
  },
  {
    icon: TreeDeciduous,
    name: 'RV College of Engineering',
    type: 'Micro Level',
    description: 'Detailed analysis of campus vegetation including specific zones and green spaces',
    chiRange: '40-80',
    link: '/study-area?type=rvce',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-soft" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <img src="/image.png" alt="UCHI" className="h-4 w-4 rounded" />
              Environmental Intelligence Platform
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Dynamic Urban Canopy
              <span className="block text-primary">Health Index</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Advanced vegetation health monitoring for sustainable urban development. 
              Analyze satellite imagery to assess green cover quality across Bengaluru and RVCE campus.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button variant="nature" size="xl" asChild>
                <Link to="/study-area">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/upload">
                  Upload Image
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Vegetation Analysis
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines satellite imagery processing with advanced algorithms 
              to deliver accurate vegetation health assessments.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title} 
                  className="gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-medium animate-fade-in"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Study Areas Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
              <MapPin className="h-4 w-4" />
              Study Areas
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Analysis Region
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select between macro-level city analysis or micro-level campus assessment 
              for detailed vegetation health insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {studyAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <Card 
                  key={area.name}
                  className="group gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${0.15 * index}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent">
                        {area.type}
                      </span>
                    </div>
                    <CardTitle className="font-display text-2xl mt-4">{area.name}</CardTitle>
                    <CardDescription className="text-base">{area.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-secondary/50">
                      <span className="text-sm text-muted-foreground">Expected CHI Range</span>
                      <span className="font-semibold text-foreground">{area.chiRange}</span>
                    </div>
                    <Button variant="nature" className="w-full group-hover:shadow-glow transition-shadow" asChild>
                      <Link to={area.link}>
                        Analyze {area.name}
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground">
                Our CHI calculation methodology follows established remote sensing protocols
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: '01', title: 'Image Upload', desc: 'Upload satellite imagery' },
                { step: '02', title: 'Preprocessing', desc: 'Normalize and enhance' },
                { step: '03', title: 'Detection', desc: 'AI vegetation segmentation' },
                { step: '04', title: 'CHI Output', desc: 'Health index calculation' },
              ].map((item, index) => (
                <div 
                  key={item.step}
                  className="relative p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <span className="absolute -top-3 -left-1 text-5xl font-display font-bold text-primary/10">
                    {item.step}
                  </span>
                  <div className="relative">
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-xl bg-accent/5 border border-accent/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-accent mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Ready for AI Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    This system uses dummy CHI values. Backend placeholders for 
                    <code className="mx-1 px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-xs">preprocessing.py</code>,
                    <code className="mx-1 px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-xs">vegetation_detection.py</code>, and
                    <code className="mx-1 px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-xs">chi_calculation.py</code>
                    are prepared for future AI model integration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
