# AI Integration Roadmap for UCHI

## 🎯 Current State

The application currently uses **dummy CHI values** generated randomly within region-specific ranges. The complete backend infrastructure is ready for AI integration.

### What's Working Now
- ✅ Image upload and storage
- ✅ Database schema for metadata and results
- ✅ API endpoints for all operations
- ✅ Frontend displays results beautifully
- ✅ Complete application flow

### What Needs AI
- ⏳ Image preprocessing
- ⏳ Vegetation detection and segmentation
- ⏳ Actual CHI calculation from vegetation data

## 🏗️ AI Integration Architecture

```
Image Upload
    ↓
[1] PREPROCESSING
    ├─ Normalize & resize image
    ├─ Remove noise
    ├─ Enhance vegetation features
    └─ Convert color spaces
    ↓
[2] VEGETATION DETECTION
    ├─ Segment vegetation from non-vegetation
    ├─ Classify healthy vs stressed vegetation
    ├─ Calculate coverage percentages
    └─ Generate vegetation mask
    ↓
[3] CHI CALCULATION
    ├─ Analyze canopy density
    ├─ Calculate spectral indices (NDVI, EVI)
    ├─ Combine health indicators
    └─ Output final CHI (0-100)
    ↓
Store Results in Database
    ↓
Display on Frontend
```

## 📚 Phase 1: Image Preprocessing

### File: `backend/preprocessing.py`

**Current Status**: Placeholder with TODO comments

**Implementation Tasks**:

1. **Basic Image Processing**
   ```python
   import cv2
   import numpy as np
   from PIL import Image
   
   def preprocess_image(image_path: str) -> np.ndarray:
       # Load image
       img = cv2.imread(image_path)
       
       # Resize to standard dimensions
       img = cv2.resize(img, (512, 512))
       
       # Denoise
       img = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)
       
       # Normalize
       img = img.astype(np.float32) / 255.0
       
       return img
   ```

2. **Color Space Conversion**
   - Convert RGB to LAB for better color analysis
   - Extract green channel for vegetation
   - Calculate normalized difference indices

3. **Enhancement**
   - Histogram equalization
   - Contrast adjustment
   - Vegetation feature enhancement

**Libraries Needed**:
```bash
pip install opencv-python pillow numpy
```

**Testing**:
```python
# Test preprocessing
from preprocessing import preprocess_image
processed = preprocess_image('test_image.jpg')
print(f"Processed shape: {processed.shape}")
```

## 🌿 Phase 2: Vegetation Detection

### File: `backend/vegetation_detection.py`

**Current Status**: Placeholder with example code

**Implementation Approach**:

### Option A: Deep Learning (Recommended)

1. **Model Selection**
   - **U-Net**: Best for semantic segmentation
   - **DeepLabV3+**: State-of-the-art segmentation
   - **Custom CNN**: If training from scratch

2. **Training Data**
   - Collect satellite images of vegetation
   - Manually label vegetation areas
   - Create train/validation/test splits
   - Recommended dataset size: 500+ images

3. **Model Architecture**
   ```python
   import tensorflow as tf
   from tensorflow.keras import layers
   
   def create_unet_model(input_shape=(512, 512, 3)):
       inputs = layers.Input(shape=input_shape)
       
       # Encoder
       c1 = layers.Conv2D(64, 3, activation='relu', padding='same')(inputs)
       c1 = layers.Conv2D(64, 3, activation='relu', padding='same')(c1)
       p1 = layers.MaxPooling2D(2)(c1)
       
       # ... more encoder layers
       
       # Decoder
       # ... decoder layers
       
       outputs = layers.Conv2D(1, 1, activation='sigmoid')(final)
       
       model = tf.keras.Model(inputs, outputs)
       return model
   ```

4. **Training**
   ```python
   model = create_unet_model()
   model.compile(
       optimizer='adam',
       loss='binary_crossentropy',
       metrics=['accuracy', 'iou']
   )
   
   model.fit(
       train_dataset,
       validation_data=val_dataset,
       epochs=50,
       callbacks=[early_stopping, model_checkpoint]
   )
   ```

5. **Inference**
   ```python
   def detect_vegetation(image: np.ndarray) -> np.ndarray:
       # Load trained model
       model = tf.keras.models.load_model('models/vegetation_segmentation.h5')
       
       # Prepare input
       img_input = np.expand_dims(image, axis=0)
       
       # Predict
       mask = model.predict(img_input)[0]
       
       # Threshold
       vegetation_mask = (mask > 0.5).astype(np.uint8)
       
       return vegetation_mask
   ```

### Option B: Traditional Computer Vision (Simpler)

```python
def detect_vegetation_traditional(image: np.ndarray) -> np.ndarray:
    # Convert to HSV
    hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
    
    # Define green color range
    lower_green = np.array([35, 40, 40])
    upper_green = np.array([85, 255, 255])
    
    # Create mask
    mask = cv2.inRange(hsv, lower_green, upper_green)
    
    # Morphological operations to clean up
    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    
    return mask
```

**Health Classification**:
```python
def classify_vegetation_health(image: np.ndarray, mask: np.ndarray):
    # Extract vegetation pixels
    veg_pixels = image[mask == 1]
    
    # Calculate health indicators
    # Healthy: High green, good brightness
    # Stressed: Yellowing, low green
    
    green_ratio = veg_pixels[:, 1] / (veg_pixels.sum(axis=1) + 1e-6)
    
    # Threshold for health
    healthy_mask = green_ratio > 0.4
    stressed_mask = ~healthy_mask
    
    return healthy_mask, stressed_mask
```

**Libraries Needed**:
```bash
# Deep Learning
pip install tensorflow numpy opencv-python

# Or PyTorch
pip install torch torchvision numpy opencv-python
```

## 🧮 Phase 3: CHI Calculation

### File: `backend/chi_calculation.py`

**Current Status**: Placeholder with formula comments

**Implementation**:

### CHI Formula Design

```python
def calculate_chi(image: np.ndarray, 
                 vegetation_mask: np.ndarray,
                 healthy_mask: np.ndarray = None,
                 stressed_mask: np.ndarray = None) -> Dict[str, float]:
    
    # 1. Vegetation Coverage
    total_pixels = vegetation_mask.size
    veg_pixels = np.sum(vegetation_mask)
    coverage = (veg_pixels / total_pixels) * 100
    
    # 2. Health Ratio
    if healthy_mask is not None and stressed_mask is not None:
        healthy_pixels = np.sum(healthy_mask)
        health_ratio = (healthy_pixels / (veg_pixels + 1e-6)) * 100
    else:
        health_ratio = 70.0  # default
    
    # 3. Canopy Density
    density = analyze_canopy_density(vegetation_mask)
    
    # 4. Spectral Indices (if multispectral available)
    spectral_index = calculate_ndvi(image) if has_nir_band(image) else 50
    
    # 5. Weighted CHI Calculation
    weights = {
        'coverage': 0.25,
        'health': 0.40,
        'density': 0.20,
        'spectral': 0.15
    }
    
    chi = (
        coverage * weights['coverage'] +
        health_ratio * weights['health'] +
        density * weights['density'] +
        spectral_index * weights['spectral']
    )
    
    # Normalize to 0-100 range
    chi = np.clip(chi, 0, 100)
    
    return {
        'chi_value': round(chi, 2),
        'vegetation_coverage': round(coverage, 2),
        'healthy_percentage': round(health_ratio, 2),
        'stressed_percentage': round(100 - health_ratio, 2),
        'confidence': 0.85
    }
```

### Advanced: Spectral Indices

```python
def calculate_ndvi(image: np.ndarray) -> float:
    """
    Calculate NDVI if NIR band is available
    NDVI = (NIR - Red) / (NIR + Red)
    """
    if image.shape[2] < 4:
        return 50  # Default if no NIR
    
    nir = image[:, :, 3].astype(float)
    red = image[:, :, 2].astype(float)
    
    ndvi = (nir - red) / (nir + red + 1e-6)
    ndvi = np.clip(ndvi, -1, 1)
    
    # Normalize to 0-100
    ndvi_normalized = ((ndvi + 1) / 2) * 100
    
    return np.mean(ndvi_normalized)
```

### Region-Specific Calibration

```python
def calibrate_chi_for_region(chi: float, region: str) -> float:
    """
    Apply region-specific adjustments
    Based on ground truth data collection
    """
    calibration_factors = {
        'Bengaluru': 1.0,
        'Campus': 1.1,      # Campus tends to be greener
        'Sports Ground': 1.05,
        'Parking': 0.9,     # Less vegetation expected
        'Roadside': 0.85,
        'Hostel': 1.0
    }
    
    factor = calibration_factors.get(region, 1.0)
    calibrated = chi * factor
    
    return np.clip(calibrated, 0, 100)
```

## 🔄 Integration Steps

### Step 1: Update `backend/app.py`

Replace dummy CHI generation with AI pipeline:

```python
@app.route('/upload-image', methods=['POST'])
def upload_image():
    # ... file upload code ...
    
    # AI INTEGRATION POINT - Uncomment when ready:
    
    # Step 1: Preprocess
    from preprocessing import preprocess_image
    processed_image = preprocess_image(filepath)
    
    # Step 2: Detect vegetation
    from vegetation_detection import detect_vegetation, classify_vegetation_health
    vegetation_mask = detect_vegetation(processed_image)
    healthy_mask, stressed_mask = classify_vegetation_health(processed_image, vegetation_mask)
    
    # Step 3: Calculate CHI
    from chi_calculation import calculate_chi, calibrate_chi_for_region
    chi_data = calculate_chi(processed_image, vegetation_mask, healthy_mask, stressed_mask)
    
    # Apply calibration
    region = sub_region if sub_region else area_type
    chi_value = calibrate_chi_for_region(chi_data['chi_value'], region)
    
    # Use chi_value and chi_data metrics...
    # ... rest of the code
```

### Step 2: Install Dependencies

```bash
# Update requirements.txt
opencv-python==4.8.1.78
Pillow==10.1.0
tensorflow==2.15.0  # or torch==2.1.1
numpy==1.26.2
scikit-image==0.22.0
```

### Step 3: Add Models Directory

```bash
mkdir backend/models
# Place trained model here:
# backend/models/vegetation_segmentation.h5
```

### Step 4: Test Integration

```python
# Test script
from preprocessing import preprocess_image
from vegetation_detection import detect_vegetation
from chi_calculation import calculate_chi

# Test with sample image
image_path = 'test_images/sample.jpg'
processed = preprocess_image(image_path)
mask = detect_vegetation(processed)
chi_data = calculate_chi(processed, mask)

print(f"CHI: {chi_data['chi_value']}")
print(f"Coverage: {chi_data['vegetation_coverage']}%")
```

## 📊 Data Collection Strategy

### For Training Vegetation Detection Model

1. **Collect Satellite Images**
   - Google Earth imagery
   - Sentinel-2 satellite data (free)
   - Landsat imagery (free)
   - Drone footage if available

2. **Label Data**
   - Use tools like LabelMe or CVAT
   - Mark vegetation areas
   - Classify healthy vs stressed
   - Minimum 500 labeled images

3. **Create Dataset**
   ```
   dataset/
   ├── train/
   │   ├── images/
   │   └── masks/
   ├── validation/
   │   ├── images/
   │   └── masks/
   └── test/
       ├── images/
       └── masks/
   ```

### Ground Truth Data Collection

For calibration and validation:

1. Visit actual sites (RVCE campus, Bengaluru areas)
2. Take photos
3. Measure actual vegetation coverage
4. Expert assessment of health
5. Use this data to validate CHI calculations

## 🎯 Implementation Timeline

**Week 1-2**: Data Collection
- Gather satellite images
- Label training data

**Week 3-4**: Model Training
- Train segmentation model
- Validate accuracy
- Tune hyperparameters

**Week 5**: Integration
- Implement preprocessing
- Integrate model
- Implement CHI calculation

**Week 6**: Testing & Calibration
- Test with real images
- Compare with ground truth
- Calibrate algorithms

**Week 7**: Optimization
- Improve performance
- Handle edge cases
- Error handling

**Week 8**: Documentation & Deployment
- Document AI components
- Deploy to production
- Create user guide

## 📚 Learning Resources

### Computer Vision
- [OpenCV Python Tutorials](https://docs.opencv.org/master/d6/d00/tutorial_py_root.html)
- [Digital Image Processing (Gonzalez)](https://www.amazon.com/Digital-Image-Processing-Rafael-Gonzalez/dp/0133356728)

### Deep Learning
- [TensorFlow Segmentation Tutorial](https://www.tensorflow.org/tutorials/images/segmentation)
- [U-Net Paper](https://arxiv.org/abs/1505.04597)
- [Fast.ai Course](https://course.fast.ai/)

### Remote Sensing
- [NDVI Explained](https://en.wikipedia.org/wiki/Normalized_difference_vegetation_index)
- [Sentinel-2 Data](https://scihub.copernicus.eu/)
- [Google Earth Engine](https://earthengine.google.com/)

## ✅ Success Metrics

Your AI integration is successful when:

- [ ] Model achieves >85% accuracy on test data
- [ ] Segmentation looks visually correct
- [ ] CHI values match expert assessments
- [ ] Processing time < 10 seconds per image
- [ ] Results are reproducible
- [ ] Edge cases handled properly

## 🚀 Quick Start for AI Development

```bash
# 1. Setup AI development environment
cd backend
python -m venv ai_env
source ai_env/bin/activate  # or ai_env\Scripts\activate on Windows

# 2. Install AI libraries
pip install tensorflow opencv-python pillow numpy scikit-image

# 3. Create models directory
mkdir models

# 4. Start with simple traditional CV approach
# Implement detect_vegetation_traditional() first

# 5. Test with sample images
python -c "from vegetation_detection import detect_vegetation_traditional; print('AI module loaded!')"

# 6. Gradually replace with deep learning
```

---

**Remember**: Start simple, iterate, and improve. The current dummy implementation gives you time to develop and train proper AI models without blocking the rest of the project!

**Good luck with AI integration! 🤖🌿**
