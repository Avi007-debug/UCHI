import { Download, FileJson, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BACKEND_URL, USE_MOCK_API } from '@/services/apiConfig';

export function DataExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    
    try {
      // If using mock API, export the static data from public/data/chi_results.json
      if (USE_MOCK_API) {
        const resp = await fetch('/data/chi_results.json');
        if (!resp.ok) throw new Error('Failed to load mock data for export');
        const data = await resp.json();

        if (format === 'csv') {
          const regions = Object.keys(data);
          const csvRows = [
            'Region,Location,Area Type,CHI Score,Status,Interpretation,Vegetation Coverage (%),Greenness Intensity,Images Processed,Images Filtered,Total Images,Date'
          ];

          regions.forEach(region => {
            const r = data[region] || {};
            const chi = typeof r.chi_score === 'number' ? r.chi_score.toFixed(2) : r.chi_score ?? '';
            const veg = r.metrics && typeof r.metrics.vegetation_coverage === 'number' ? r.metrics.vegetation_coverage.toFixed(2) : '';
            const green = r.metrics && typeof r.metrics.greenness_intensity === 'number' ? r.metrics.greenness_intensity.toFixed(2) : '';
            const interp = r.interpretation ? String(r.interpretation).replace(/"/g, '""') : '';

            csvRows.push([
              region,
              r.location ?? '',
              r.area_type ?? '',
              chi,
              r.status ?? '',
              `"${interp}"`,
              veg,
              green,
              r.images_processed ?? '',
              r.images_filtered ?? '',
              r.total_images ?? '',
              r.date ?? ''
            ].join(','));
          });

          const csvContent = csvRows.join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'uchi_results.csv';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          const jsonContent = JSON.stringify(data, null, 2);
          const blob = new Blob([jsonContent], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'uchi_complete_export.json';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }

        toast({
          title: 'Export successful',
          description: `Data exported as ${format === 'csv' ? 'uchi_results.csv' : 'uchi_complete_export.json'}`,
        });
        setIsExporting(false);
        return;
      }

      const response = await fetch(`${BACKEND_URL}/export/${format}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = format === 'csv' ? 'uchi_results.csv' : 'uchi_complete_export.json';
      
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Export successful',
        description: `Data exported as ${filename}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
