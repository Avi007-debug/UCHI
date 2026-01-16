"""
Dataset Validation Script for UCHI
Validates all images in raw_images folder for quality and format
"""

import os
from pathlib import Path
from PIL import Image
import numpy as np

def validate_image(filepath):
    """
    Validate image format and quality
    
    Args:
        filepath: Path to image file
        
    Returns:
        tuple: (is_valid, message)
    """
    try:
        img = Image.open(filepath)
        img_array = np.array(img)
        
        # Check dimensions
        if img_array.shape[0] < 100 or img_array.shape[1] < 100:
            return False, "Image too small (minimum 100x100 pixels required)"
        
        # Check channels
        if len(img_array.shape) != 3:
            return False, "Image must be RGB (3 channels)"
        
        if img_array.shape[2] != 3:
            return False, f"Expected 3 channels (RGB), got {img_array.shape[2]}"
        
        # Check if not completely blank
        mean_value = img_array.mean()
        if mean_value < 10:
            return False, "Image appears completely black/blank"
        
        if mean_value > 245:
            return False, "Image appears completely white/overexposed"
        
        # Check for color variation (not monochrome)
        std_value = img_array.std()
        if std_value < 5:
            return False, "Image has very low variation (might be corrupted)"
        
        # All checks passed
        size_mb = os.path.getsize(filepath) / (1024 * 1024)
        return True, f"Valid ({img_array.shape[1]}x{img_array.shape[0]} pixels, {size_mb:.2f} MB)"
        
    except Exception as e:
        return False, f"Error reading image: {str(e)}"

def check_folder_structure():
    """Check if required folder structure exists"""
    base_dir = Path(__file__).parent.parent / "data"
    required_folders = [
        "raw_images/bangalore",
        "raw_images/rvce",
        "processed_images/bangalore",
        "processed_images/rvce",
        "vegetation_masks/bangalore",
        "vegetation_masks/rvce",
        "chi_results/bangalore",
        "chi_results/rvce",
    ]
    
    missing_folders = []
    for folder in required_folders:
        folder_path = base_dir / folder
        if not folder_path.exists():
            missing_folders.append(str(folder_path))
    
    return missing_folders

def main():
    """Main validation function"""
    print("=" * 70)
    print("UCHI Dataset Validation")
    print("=" * 70)
    
    # Check folder structure
    print("\n📁 Checking folder structure...")
    missing = check_folder_structure()
    if missing:
        print("❌ Missing folders:")
        for folder in missing:
            print(f"   - {folder}")
        print("\nCreating missing folders...")
        base_dir = Path(__file__).parent.parent / "data"
        for folder in ["raw_images/bangalore", "raw_images/rvce", 
                      "processed_images/bangalore", "processed_images/rvce",
                      "vegetation_masks/bangalore", "vegetation_masks/rvce",
                      "chi_results/bangalore", "chi_results/rvce"]:
            (base_dir / folder).mkdir(parents=True, exist_ok=True)
        print("✅ Folders created!")
    else:
        print("✅ All required folders exist")
    
    # Validate images
    data_dir = Path(__file__).parent.parent / "data" / "raw_images"
    
    total_valid = 0
    total_invalid = 0
    
    for region in ["bangalore", "rvce"]:
        region_path = data_dir / region
        
        # Find all images
        image_extensions = ['.tif', '.tiff', '.jpg', '.jpeg', '.png']
        images = []
        for ext in image_extensions:
            images.extend(region_path.glob(f"*{ext}"))
            images.extend(region_path.glob(f"*{ext.upper()}"))
        
        print(f"\n📂 {region.upper()}")
        print(f"   Found: {len(images)} image(s)")
        
        if len(images) == 0:
            print(f"   ⚠️  No images found in {region_path}")
            print(f"   💡 Add satellite images to: {region_path}")
            continue
        
        # Validate each image
        for img_path in images:
            valid, msg = validate_image(img_path)
            status = "✅" if valid else "❌"
            print(f"   {status} {img_path.name}: {msg}")
            
            if valid:
                total_valid += 1
            else:
                total_invalid += 1
    
    # Summary
    print("\n" + "=" * 70)
    print("VALIDATION SUMMARY")
    print("=" * 70)
    print(f"✅ Valid images: {total_valid}")
    print(f"❌ Invalid images: {total_invalid}")
    print(f"📊 Total: {total_valid + total_invalid}")
    
    if total_invalid > 0:
        print("\n⚠️  Some images failed validation. Please fix them before processing.")
        return False
    elif total_valid == 0:
        print("\n⚠️  No valid images found!")
        print("\n💡 Next Steps:")
        print("   1. Download satellite imagery (see DATASET_COMPILATION_GUIDE.md)")
        print("   2. Place images in backend/data/raw_images/bangalore/ or /rvce/")
        print("   3. Run this script again to validate")
        return False
    else:
        print("\n🎉 All images are valid! Ready for processing.")
        print("\n💡 Next Step:")
        print("   Run: python run_cv_pipeline.py")
        return True

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
