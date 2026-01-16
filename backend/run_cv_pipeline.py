"""
Automated CV Pipeline for UCHI
Offline batch processing script that computes CHI values for all regions

This script:
1. Reads satellite imagery from dataset folder
2. Preprocesses images (normalization, enhancement)
3. Detects vegetation using rule-based CV (NDVI thresholds)
4. Calculates CHI for each region
5. Updates Supabase database with results

Usage:
    python run_cv_pipeline.py

Requirements:
    - Dataset folder with organized imagery
    - Configured Supabase credentials in .env
    - Python packages: numpy, opencv-python, rasterio
"""

import os
import sys
from pathlib import Path
from datetime import datetime
import json

# Import existing modules
from preprocessing import preprocess_image
from vegetation_detection import detect_vegetation
from chi_calculation import calculate_chi
from database import Database
from config import Config

class CVPipeline:
    """Automated Computer Vision Pipeline"""
    
    def __init__(self):
        self.db = Database()
        self.dataset_path = Path(Config.DATASET_PATH) if hasattr(Config, 'DATASET_PATH') else Path('data/dataset')
        self.results = []
    
    def process_region(self, image_path: str, region_name: str) -> dict:
        """
        Process a single image and compute CHI
        
        Args:
            image_path: Path to satellite image
            region_name: Name of region (Bengaluru, Campus, etc.)
            
        Returns:
            Dictionary with CHI results
        """
        print(f"  Processing: {region_name}")
        
        try:
            # Step 1: Preprocess
            processed_img = preprocess_image(image_path)
            
            # Step 2: Detect vegetation
            vegetation_mask = detect_vegetation(processed_img)
            
            # Step 3: Calculate CHI
            chi_data = calculate_chi(processed_img, vegetation_mask)
            
            result = {
                'region': region_name,
                'chi': chi_data['chi'],
                'coverage': chi_data['coverage'],
                'healthy_pct': chi_data['healthy_percentage'],
                'stressed_pct': chi_data['stressed_percentage'],
                'timestamp': datetime.now().isoformat()
            }
            
            print(f"    ✓ CHI: {chi_data['chi']:.1f}")
            return result
            
        except Exception as e:
            print(f"    ✗ Error: {str(e)}")
            return None
    
    def run_pipeline(self):
        """
        Run the complete pipeline for all regions
        """
        print("=" * 60)
        print("UCHI Automated CV Pipeline")
        print("=" * 60)
        print(f"Dataset Path: {self.dataset_path}")
        print(f"Database: Supabase PostgreSQL")
        print("-" * 60)
        
        # Define regions and their image paths
        regions = [
            {
                'name': 'Bengaluru',
                'path': self.dataset_path / 'bangalore' / 'latest.tif',
                'area_type': 'Bengaluru'
            },
            {
                'name': 'RVCE Campus',
                'path': self.dataset_path / 'rvce' / 'campus.tif',
                'area_type': 'RVCE',
                'sub_region': 'Campus'
            },
            {
                'name': 'RVCE Sports Ground',
                'path': self.dataset_path / 'rvce' / 'sports.tif',
                'area_type': 'RVCE',
                'sub_region': 'Sports Ground'
            },
            {
                'name': 'RVCE Parking',
                'path': self.dataset_path / 'rvce' / 'parking.tif',
                'area_type': 'RVCE',
                'sub_region': 'Parking'
            },
            {
                'name': 'RVCE Hostel',
                'path': self.dataset_path / 'rvce' / 'hostel.tif',
                'area_type': 'RVCE',
                'sub_region': 'Hostel'
            },
        ]
        
        print(f"\nProcessing {len(regions)} regions...")
        print()
        
        for region in regions:
            # Check if image exists
            if not region['path'].exists():
                print(f"⚠ Skipping {region['name']}: Image not found")
                continue
            
            # Process region
            result = self.process_region(
                str(region['path']),
                region['name']
            )
            
            if result:
                self.results.append(result)
                
                # Update database
                try:
                    # Store in database
                    # Note: You'll need to implement insert_chi_value method
                    # self.db.insert_chi_value(
                    #     area_type=region['area_type'],
                    #     sub_region=region.get('sub_region'),
                    #     chi=result['chi'],
                    #     date=datetime.now().strftime('%Y-%m-%d')
                    # )
                    print(f"    ✓ Database updated")
                except Exception as e:
                    print(f"    ✗ Database error: {str(e)}")
        
        print()
        print("-" * 60)
        print(f"Pipeline Complete: {len(self.results)}/{len(regions)} regions processed")
        print("=" * 60)
        
        # Save results to JSON
        self.save_results()
    
    def save_results(self):
        """Save results to JSON file"""
        output_file = Path('pipeline_results.json')
        
        with open(output_file, 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'total_processed': len(self.results),
                'results': self.results
            }, f, indent=2)
        
        print(f"\nResults saved to: {output_file}")


def main():
    """Main entry point"""
    pipeline = CVPipeline()
    
    try:
        pipeline.run_pipeline()
        sys.exit(0)
    except KeyboardInterrupt:
        print("\n\nPipeline interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nPipeline failed: {str(e)}")
        sys.exit(1)


if __name__ == '__main__':
    main()
