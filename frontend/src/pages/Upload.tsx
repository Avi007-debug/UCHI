import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ImageUploader from '@/components/upload/ImageUploader';
import CHICard from '@/components/chi/CHICard';
import type { CHIResult } from '@/types/uchi';
import { Upload as UploadIcon, Image, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Upload = () => {
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState<CHIResult | null>(null);

  const handleResult = (newResult: CHIResult) => {
    setResult(newResult);
  };

  return (
    <div className="py-12">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <UploadIcon className="h-4 w-4" />
            Image Analysis
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Upload Satellite Image
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload satellite or aerial imagery for vegetation health analysis. 
            Supported formats: JPG, PNG
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="space-y-6">
            <ImageUploader onResult={handleResult} />

            {/* Guidelines Card */}
            <Card className="border-accent/30 bg-accent/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4 text-accent" />
                  Image Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Use high-resolution satellite or aerial imagery</p>
                <p>• Ensure image covers the selected region</p>
                <p>• Prefer cloud-free images for accurate analysis</p>
                <p>• RGB or multispectral images work best</p>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {result ? (
              <CHICard
                title={result.subRegion || result.areaType}
                description={`Analysis performed on ${result.date}`}
                chiValue={result.chiValue}
                status={result.status}
                interpretation={result.interpretation}
                vegetationCoverage={result.vegetationCoverage}
                healthyVegetation={result.healthyVegetation}
                stressedVegetation={result.stressedVegetation}
              />
            ) : (
              <Card className="gradient-card h-full min-h-[400px] flex flex-col items-center justify-center">
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
                    <Image className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Analysis Yet
                  </h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    Upload an image to see vegetation health analysis results here
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Backend Integration Note */}
            <Card className="border-dashed border-2 border-border bg-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  🔧 Backend Integration Point
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p><strong>Current:</strong> Using dummy CHI values</p>
                <p><strong>Future:</strong> Replace with API call to:</p>
                <code className="block mt-2 p-2 rounded bg-secondary text-secondary-foreground">
                  POST /upload-image → preprocessing.py → vegetation_detection.py → chi_calculation.py
                </code>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
