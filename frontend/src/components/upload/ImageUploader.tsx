import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Image, X, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AreaType, RVCESubRegion, CHIResult } from '@/types/uchi';
import { uploadImage } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onResult?: (result: CHIResult) => void;
}

const RVCE_REGIONS: RVCESubRegion[] = ['Campus', 'Sports Ground', 'Parking', 'Hostel', 'Roadside'];

const ImageUploader = ({ onResult }: ImageUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [areaType, setAreaType] = useState<AreaType>('Bengaluru');
  const [subRegion, setSubRegion] = useState<RVCESubRegion | undefined>();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setUploadComplete(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const clearFile = () => {
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setUploadComplete(false);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select an image to upload.',
        variant: 'destructive',
      });
      return;
    }

    if (areaType === 'RVCE' && !subRegion) {
      toast({
        title: 'Sub-region required',
        description: 'Please select a sub-region for RVCE analysis.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadImage({
        file,
        areaType,
        subRegion: areaType === 'RVCE' ? subRegion : undefined,
        date,
      });

      setUploadComplete(true);
      toast({
        title: 'Analysis Complete',
        description: `CHI Value: ${result.chiValue} (${result.status})`,
      });

      if (onResult) {
        onResult(result);
      }
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'An error occurred during image analysis.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="font-display text-xl">Upload Satellite Image</CardTitle>
        <CardDescription>
          Upload a satellite or aerial image for vegetation health analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50 hover:bg-secondary/30',
            file && 'border-primary/50'
          )}
        >
          <input {...getInputProps()} />
          
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg object-contain"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              {uploadComplete && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                  <div className="flex items-center gap-2 text-chi-good">
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-medium">Analysis Complete</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {isDragActive ? 'Drop the image here' : 'Drag & drop your image here'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse (JPG, PNG)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="area-type">Area Type</Label>
            <Select value={areaType} onValueChange={(v) => setAreaType(v as AreaType)}>
              <SelectTrigger id="area-type">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bengaluru">Bengaluru (Macro Level)</SelectItem>
                <SelectItem value="RVCE">RVCE (Micro Level)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {areaType === 'RVCE' && (
            <div className="space-y-2">
              <Label htmlFor="sub-region">Sub-Region</Label>
              <Select value={subRegion} onValueChange={(v) => setSubRegion(v as RVCESubRegion)}>
                <SelectTrigger id="sub-region">
                  <SelectValue placeholder="Select sub-region" />
                </SelectTrigger>
                <SelectContent>
                  {RVCE_REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="date">Analysis Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Upload Button */}
        <Button
          variant="nature"
          size="lg"
          className="w-full"
          onClick={handleUpload}
          disabled={!file || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Image className="h-5 w-5" />
              Analyze Image
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
