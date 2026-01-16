"""
Image Diagnostic Tool
Visualize vegetation detection to understand low CHI scores
"""

import cv2
import numpy as np
from pathlib import Path
import sys

def visualize_vegetation_detection(image_path, output_dir="debug_output"):
    """
    Create visualization showing what the CV pipeline detects
    """
    # Read image
    image = cv2.imread(str(image_path))
    if image is None:
        print(f"Error: Could not read {image_path}")
        return
    
    # Resize
    resized = cv2.resize(image, (512, 512))
    
    # Convert to HSV
    hsv = cv2.cvtColor(resized, cv2.COLOR_BGR2HSV)
    
    # Green detection (same as pipeline)
    lower_green = np.array([35, 40, 40])
    upper_green = np.array([85, 255, 255])
    vegetation_mask = cv2.inRange(hsv, lower_green, upper_green)
    
    # Calculate stats
    total_pixels = vegetation_mask.size
    veg_pixels = np.count_nonzero(vegetation_mask)
    coverage = (veg_pixels / total_pixels) * 100
    
    # Create colored overlay
    overlay = resized.copy()
    overlay[vegetation_mask > 0] = [0, 255, 0]  # Green overlay on detected vegetation
    result = cv2.addWeighted(resized, 0.7, overlay, 0.3, 0)
    
    # Add text
    text = f"Vegetation: {coverage:.1f}%"
    cv2.putText(result, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
    
    # Create output directory
    Path(output_dir).mkdir(exist_ok=True)
    
    # Save visualization
    output_path = Path(output_dir) / f"debug_{Path(image_path).name}"
    cv2.imwrite(str(output_path), result)
    
    # Also save the mask
    mask_path = Path(output_dir) / f"mask_{Path(image_path).name}"
    cv2.imwrite(str(mask_path), vegetation_mask)
    
    print(f"✓ {Path(image_path).name}")
    print(f"  Vegetation Coverage: {coverage:.1f}%")
    print(f"  Saved: {output_path}")
    print(f"  Mask: {mask_path}")
    print()
    
    return coverage

def analyze_dataset(dataset_dir):
    """
    Analyze all images in a dataset directory
    """
    dataset_path = Path(dataset_dir)
    
    if not dataset_path.exists():
        print(f"Error: Directory not found - {dataset_path}")
        return
    
    # Find images
    image_extensions = {'.jpg', '.jpeg', '.png', '.bmp'}
    image_files = [f for f in dataset_path.iterdir() if f.suffix.lower() in image_extensions]
    
    if not image_files:
        print(f"No images found in {dataset_path}")
        return
    
    print(f"\n{'='*60}")
    print(f"Analyzing {dataset_path.name.upper()}: {len(image_files)} images")
    print(f"{'='*60}\n")
    
    coverages = []
    for img_path in image_files:
        coverage = visualize_vegetation_detection(img_path)
        if coverage is not None:
            coverages.append(coverage)
    
    if coverages:
        avg_coverage = np.mean(coverages)
        print(f"{'='*60}")
        print(f"Average Vegetation Coverage: {avg_coverage:.1f}%")
        print(f"{'='*60}\n")
        
        # Provide recommendations
        if avg_coverage < 20:
            print("⚠️  LOW VEGETATION DETECTED")
            print("\nPossible reasons:")
            print("1. Images are mostly urban/built-up areas (buildings, roads)")
            print("2. Images taken in dry season with brown/yellow vegetation")
            print("3. Images are aerial/satellite views showing mostly infrastructure")
            print("4. Image quality issues (overexposed, shadows)")
            print("\nRecommendations:")
            print("• Take images focusing on parks, gardens, tree canopies")
            print("• Capture images during monsoon/green season")
            print("• Include street-level shots showing tree cover")
            print("• Adjust HSV thresholds if vegetation appears yellow/brown")

def main():
    """Run diagnostics on specific images or entire datasets"""
    
    if len(sys.argv) > 1:
        # Analyze specific path
        path = sys.argv[1]
        if Path(path).is_file():
            visualize_vegetation_detection(path)
        else:
            analyze_dataset(path)
    else:
        # Analyze both datasets
        print("\nImage Diagnostic Tool")
        print("Visualizing vegetation detection for all images...\n")
        
        for location in ['bangalore', 'rvce']:
            dataset_path = Path('datasets') / location
            if dataset_path.exists():
                analyze_dataset(dataset_path)
        
        print("\n✓ Check the 'debug_output' folder to see:")
        print("  - Green overlays showing detected vegetation")
        print("  - Binary masks showing exactly what's detected")
        print("\nThis will help you understand why CHI scores are low.")

if __name__ == "__main__":
    main()
