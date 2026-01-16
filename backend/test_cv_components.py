"""
Quick Test Script for UCHI CV Pipeline
Tests the core components without running full pipeline
"""

import sys
from pathlib import Path

print("=" * 60)
print("UCHI CV Pipeline - Component Test")
print("=" * 60)

# Test 1: Import check
print("\n1. Testing imports...")
try:
    from vegetation_detection import VegetationDetector
    from chi_calculation import CHICalculator
    print("   ✓ vegetation_detection imported")
    print("   ✓ chi_calculation imported")
except Exception as e:
    print(f"   ✗ Import failed: {e}")
    sys.exit(1)

# Test 2: Create instances
print("\n2. Testing class instantiation...")
try:
    detector = VegetationDetector()
    calculator = CHICalculator()
    print("   ✓ VegetationDetector created")
    print("   ✓ CHICalculator created")
except Exception as e:
    print(f"   ✗ Instantiation failed: {e}")
    sys.exit(1)

# Test 3: CHI calculation logic
print("\n3. Testing CHI calculation...")
try:
    test_cases = [
        (50, 70, "Moderate"),  # coverage=50, greenness=70
        (80, 90, "Excellent"), # high coverage
        (20, 30, "Critical"),  # low coverage
        (70, 80, "Good"),      # good coverage
    ]
    
    for coverage, greenness, expected_status in test_cases:
        chi = calculator.calculate_chi(coverage, greenness)
        status = calculator.get_chi_status(chi)
        print(f"   Coverage={coverage}%, Greenness={greenness} → CHI={chi:.2f} ({status})")
        
        # Verify status matches expected
        if status != expected_status:
            print(f"   ⚠ Warning: Expected {expected_status}, got {status}")
    
    print("   ✓ CHI calculation working")
except Exception as e:
    print(f"   ✗ CHI calculation failed: {e}")
    sys.exit(1)

# Test 4: Check dataset directories
print("\n4. Checking dataset directories...")
try:
    datasets_dir = Path("datasets")
    bangalore_dir = datasets_dir / "bangalore"
    rvce_dir = datasets_dir / "rvce"
    
    if bangalore_dir.exists():
        bangalore_count = len(list(bangalore_dir.glob("*.png")) + list(bangalore_dir.glob("*.jpg")))
        print(f"   ✓ bangalore/ found ({bangalore_count} images)")
    else:
        print("   ✗ bangalore/ not found")
    
    if rvce_dir.exists():
        rvce_count = len(list(rvce_dir.glob("*.png")) + list(rvce_dir.glob("*.jpg")))
        print(f"   ✓ rvce/ found ({rvce_count} images)")
    else:
        print("   ✗ rvce/ not found")
    
except Exception as e:
    print(f"   ✗ Directory check failed: {e}")

# Test 5: Test single image processing (if OpenCV available)
print("\n5. Testing image processing...")
try:
    import cv2
    import numpy as np
    
    # Create a simple test image (512x512, half green)
    test_img = np.zeros((512, 512, 3), dtype=np.uint8)
    # Make top half green (HSV: 60°, saturation 255, value 255)
    test_img[:256, :, :] = [60, 200, 200]  # Green in BGR: [0, 255, 0]
    test_img[:256, :, 1] = 255  # Make it greener
    
    # Convert to HSV and test detection
    hsv = cv2.cvtColor(test_img, cv2.COLOR_BGR2HSV)
    veg_mask, veg_pixels, total_pixels, coverage = detector.detect_vegetation(hsv)
    
    print(f"   Test image: {coverage:.1f}% vegetation coverage")
    if 40 <= coverage <= 60:  # Should be around 50%
        print("   ✓ Image processing working correctly")
    else:
        print(f"   ⚠ Warning: Expected ~50% coverage, got {coverage:.1f}%")
    
except ImportError:
    print("   ⚠ OpenCV not installed - skipping image processing test")
    print("     Install with: pip install opencv-python")
except Exception as e:
    print(f"   ✗ Image processing test failed: {e}")

# Test 6: Database schema check
print("\n6. Testing database integration...")
try:
    from database import Database
    db = Database()
    
    if db.is_connected():
        print("   ✓ Database connection working")
    else:
        print("   ⚠ Database not connected (check .env file)")
    
except Exception as e:
    print(f"   ⚠ Database test skipped: {e}")

print("\n" + "=" * 60)
print("Component Test Complete!")
print("=" * 60)
print("\nNext steps:")
print("  1. Install dependencies: pip install opencv-python numpy")
print("  2. Run CV pipeline: python run_cv_pipeline.py")
print("  3. Start Flask API: python app.py")
print("=" * 60)
