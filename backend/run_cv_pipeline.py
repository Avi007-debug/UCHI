"""
Computer Vision Pipeline - Batch Processor
Process all images and calculate final CHI scores for all locations
"""

import cv2
import numpy as np
import os
import json
from pathlib import Path
from datetime import datetime, date
from vegetation_detection import VegetationDetector
from chi_calculation import CHICalculator
from database import Database


class BatchProcessor:
    """
    D. Batch execution script
    Process all images and calculate final CHI
    """
    
    def __init__(self, datasets_dir="datasets"):
        self.datasets_dir = Path(datasets_dir)
        self.detector = VegetationDetector()
        self.calculator = CHICalculator()
        self.db = Database()
        self.results = {}
    
    def process_location(self, location_name, display_name, area_type_semantic):
        """
        Process all images for a specific location
        Returns averaged CHI and metrics
        
        Args:
            location_name: Directory name (e.g., 'bangalore', 'rvce')
            display_name: Display name for output (e.g., 'Bengaluru', 'RVCE')
            area_type_semantic: Semantic area type ('city', 'campus', 'park')
        """
        location_dir = self.datasets_dir / location_name
        
        if not location_dir.exists():
            print(f"Warning: Directory not found - {location_dir}")
            return None
        
        # Find all image files
        image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff'}
        image_files = [
            f for f in location_dir.iterdir() 
            if f.suffix.lower() in image_extensions
        ]
        
        if not image_files:
            print(f"Warning: No images found in {location_dir}")
            return None
        
        print(f"\nProcessing {display_name}: {len(image_files)} images")
        
        # Process each image
        all_metrics = []
        successful = 0
        filtered_count = 0
        
        for img_path in image_files:
            try:
                metrics = self.detector.process_image(img_path)
                
                # Filter out images with less than 5% vegetation coverage
                if metrics['vegetation_coverage'] < 5.0:
                    print(f"  ⊘ {img_path.name}: Coverage={metrics['vegetation_coverage']:.1f}% (filtered - too low)")
                    filtered_count += 1
                    continue
                
                all_metrics.append(metrics)
                successful += 1
                print(f"  ✓ {img_path.name}: Coverage={metrics['vegetation_coverage']:.1f}%")
            except Exception as e:
                print(f"  ✗ {img_path.name}: Error - {e}")
        
        if not all_metrics:
            print(f"Error: No images processed successfully for {display_name}")
            return None
        
        # Calculate averages
        avg_coverage = np.mean([m['vegetation_coverage'] for m in all_metrics])
        avg_greenness = np.mean([m['greenness_intensity'] for m in all_metrics])
        
        # Calculate final CHI with area-aware status
        final_chi = self.calculator.calculate_chi(avg_coverage, avg_greenness)
        status = self.calculator.get_chi_status(final_chi, area_type_semantic)
        interpretation = self.calculator.get_interpretation(status)
        
        result = {
            'location': display_name,
            'area_type': area_type_semantic,
            'chi_score': round(final_chi, 2),
            'status': status,
            'interpretation': interpretation,
            'metrics': {
                'vegetation_coverage': round(avg_coverage, 2),
                'greenness_intensity': round(avg_greenness, 2)
            },
            'images_processed': successful,
            'images_filtered': filtered_count,
            'total_images': len(image_files),
            'timestamp': datetime.now().isoformat(),
            'date': date.today().isoformat()
        }
        
        print(f"  Filtered {filtered_count} images with <5% coverage")
        
        return result
    
    def save_to_database(self, result):
        """
        Save CHI result to Supabase database
        
        Args:
            result: Dictionary with CHI calculation results
        """
        try:
            # Insert into database with individual arguments
            record_id = self.db.insert_chi_result(
                image_id=None,  # No image_id for batch processing
                area_type=result['area_type'],  # 'city', 'campus', or 'park'
                sub_region=None,  # Can be expanded later
                chi_value=result['chi_score'],
                status=result['status'],
                interpretation=result['interpretation'],
                date=result['date'],
                vegetation_coverage=result['metrics']['vegetation_coverage'],
                healthy_vegetation=None,  # Not using this metric
                stressed_vegetation=None  # Not using this metric
            )
            
            if record_id and record_id > 0:
                print(f"  ✓ Saved to database: {result['location']} (ID: {record_id})")
            else:
                print(f"  ✗ Failed to save to database: {result['location']}")
                
        except Exception as e:
            print(f"  ✗ Database error: {e}")
    
    def process_all_locations(self):
        """
        Process all specified locations
        Uses folder names and maps to display names
        """
        print("=" * 60)
        print("URBAN CHI - Computer Vision Pipeline")
        print("=" * 60)
        
        # Map folder names to (display_name, area_type) tuples
        # area_type must match database constraint: 'city', 'campus', or 'park'
        locations = [
            ('bangalore', 'Bengaluru', 'city'),
            ('rvce', 'RVCE', 'campus'),
            ('cubbon', 'Cubbon Park', 'park')
        ]
        
        for folder_name, display_name, area_type in locations:
            result = self.process_location(folder_name, display_name, area_type)
            if result:
                self.results[folder_name] = result
                # Save to database
                self.save_to_database(result)
        
        return self.results
    
    def save_results(self, output_file='chi_results.json'):
        """Save results to JSON file"""
        output_path = Path(output_file)
        
        with open(output_path, 'w') as f:
            json.dump(self.results, f, indent=2)
        
        print(f"\n✓ Results saved to: {output_path}")
    
    def print_summary(self):
        """Print summary of results"""
        print("\n" + "=" * 60)
        print("RESULTS SUMMARY")
        print("=" * 60)
        
        for location, data in self.results.items():
            print(f"\n{data['location'].upper()}")
            print(f"  CHI Score: {data['chi_score']}/100 ({data['status']})")
            print(f"  Vegetation Coverage: {data['metrics']['vegetation_coverage']}%")
            print(f"  Greenness Intensity: {data['metrics']['greenness_intensity']}/100")
            print(f"  Images: {data['images_processed']}/{data['total_images']} processed")
            print(f"  Interpretation: {data['interpretation']}")


def main():
    """
    Main execution function
    Run this to process all datasets and generate CHI scores
    """
    # Initialize batch processor
    processor = BatchProcessor(datasets_dir="datasets")
    
    # Process all locations
    processor.process_all_locations()
    
    # Print summary
    processor.print_summary()
    
    # Save results to JSON
    processor.save_results('chi_results.json')
    
    print("\n" + "=" * 60)
    print("Pipeline execution complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
