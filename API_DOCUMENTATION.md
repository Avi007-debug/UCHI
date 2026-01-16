# UCHI API Documentation

## Base URL
```
http://localhost:5000
```

## Endpoints

### 1. Health Check

**GET** `/health`

Check if the backend service is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-16T10:30:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": true,
    "storage": true,
    "aiModule": false
  }
}
```

---

### 2. Get Bengaluru CHI

**GET** `/chi/bangalore`

Get precomputed CHI value for Bengaluru city.

**Response:**
```json
{
  "chi": 62.5,
  "category": "Good",
  "interpretation": "The vegetation displays healthy characteristics with good canopy density. Minor stress indicators may be present but overall ecosystem function is maintained.",
  "areaType": "Bengaluru"
}
```

**CHI Categories:**
- `Excellent`: CHI ≥ 75
- `Good`: 60 ≤ CHI < 75
- `Moderate`: 45 ≤ CHI < 60
- `Poor`: 30 ≤ CHI < 45
- `Critical`: CHI < 30

---

### 3. Get RVCE CHI

**GET** `/chi/rvce`

Get precomputed CHI value for RVCE campus.

**Response:**
```json
{
  "chi": 71.3,
  "category": "Good",
  "interpretation": "The vegetation displays healthy characteristics with good canopy density. Minor stress indicators may be present but overall ecosystem function is maintained.",
  "areaType": "RVCE"
}
```

---

### 4. Get Bengaluru Geometry

**GET** `/geometry/bangalore`

Get GeoJSON boundary for Bengaluru city.

**Response:**
```json
{
  "type": "Feature",
  "properties": {
    "name": "Bengaluru",
    "areaType": "city"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [77.4601, 12.8340],
      [77.7600, 12.8340],
      [77.7600, 12.7340],
      [77.4601, 12.7340],
      [77.4601, 12.8340]
    ]]
  }
}
```

---

### 5. Get RVCE Geometry

**GET** `/geometry/rvce`

Get GeoJSON boundary for RVCE campus.

**Response:**
```json
{
  "type": "Feature",
  "properties": {
    "name": "RV College of Engineering",
    "areaType": "campus"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [77.4987, 12.9236],
      [77.5020, 12.9236],
      [77.5020, 12.9210],
      [77.4987, 12.9210],
      [77.4987, 12.9236]
    ]]
  }
}
```

---

## Legacy Endpoints (Still Available)

### Get All Results

**GET** `/get-results`

Get all CHI results from database.

**Response:**
```json
[
  {
    "id": "result-1",
    "imageId": "img-1",
    "areaType": "Bengaluru",
    "chiValue": 65.2,
    "status": "Good",
    "interpretation": "...",
    "date": "2026-01-15",
    "vegetationCoverage": 55.3,
    "healthyVegetation": 70.5,
    "stressedVegetation": 29.5
  }
]
```

---

### Get Bangalore Summary

**GET** `/get-bangalore-summary`

Get summary statistics for Bengaluru.

**Response:**
```json
{
  "overallCHI": 65,
  "status": "Good",
  "totalAnalyses": 15,
  "lastUpdated": "2026-01-16T10:00:00.000Z",
  "trendDirection": "up",
  "trendPercentage": 2.5
}
```

---

### Get RVCE Results

**GET** `/get-rvce-results`

Get results for all RVCE sub-regions.

**Response:**
```json
[
  {
    "region": "Campus",
    "chiValue": 72,
    "status": "Good",
    "lastAnalyzed": "2026-01-15"
  },
  {
    "region": "Sports Ground",
    "chiValue": 68,
    "status": "Good",
    "lastAnalyzed": "2026-01-14"
  }
]
```

---

### Temporal Comparison

**GET** `/compare/{region}`

Get temporal comparison for a specific region.

**Parameters:**
- `region` (string): Region name (e.g., "Bengaluru", "Campus", "Sports Ground")

**Response:**
```json
{
  "region": "Bengaluru",
  "oldCHI": 60,
  "oldDate": "2025-12-15",
  "newCHI": 62.5,
  "newDate": "2026-01-15",
  "change": 2.5,
  "changePercentage": 4.17,
  "direction": "increase"
}
```

---

## Error Responses

All endpoints return standard error format:

```json
{
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created (for POST endpoints)
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## CORS Configuration

The backend has CORS enabled for all origins. For production, update CORS settings in `app.py`:

```python
from flask_cors import CORS
CORS(app, origins=['https://your-frontend-domain.com'])
```

---

## CHI Color Mapping

Use these colors for consistent visualization:

| CHI Range | Color (Hex) | RGB | Category |
|-----------|-------------|-----|----------|
| ≥ 75 | `#22c55e` | rgb(34, 197, 94) | Excellent |
| 50-75 | `#eab308` | rgb(234, 179, 8) | Good |
| 25-50 | `#f97316` | rgb(249, 115, 22) | Moderate |
| < 25 | `#ef4444` | rgb(239, 68, 68) | Poor |

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:
- Flask-Limiter for rate limiting
- Redis for caching
- API key authentication

---

## Example Usage

### JavaScript/TypeScript

```typescript
// Fetch Bengaluru CHI
const response = await fetch('http://localhost:5000/chi/bangalore');
const data = await response.json();
console.log(data.chi); // 62.5

// Fetch RVCE Geometry
const geoResponse = await fetch('http://localhost:5000/geometry/rvce');
const geoData = await geoResponse.json();
console.log(geoData.geometry.coordinates);
```

### Python

```python
import requests

# Get Bengaluru CHI
response = requests.get('http://localhost:5000/chi/bangalore')
data = response.json()
print(f"Bengaluru CHI: {data['chi']}")

# Get RVCE geometry
geo_response = requests.get('http://localhost:5000/geometry/rvce')
geo_data = geo_response.json()
print(geo_data['geometry']['type'])  # Polygon
```

### cURL

```bash
# Health check
curl http://localhost:5000/health

# Get Bengaluru CHI with pretty print
curl http://localhost:5000/chi/bangalore | python -m json.tool

# Get RVCE geometry
curl http://localhost:5000/geometry/rvce
```

---

## Future Enhancements

Potential API improvements:
1. Add authentication with JWT tokens
2. Implement pagination for results endpoints
3. Add filtering parameters (date range, CHI range)
4. WebSocket endpoint for real-time updates
5. Batch endpoint to get multiple regions at once
6. Add metadata endpoint for available regions
7. Historical data endpoint with time series

---

## Notes

- All CHI values are currently hardcoded
- Geometry coordinates are simplified (production should use detailed GeoJSON)
- Database queries are placeholder (replace with actual Supabase queries)
- No authentication currently required
