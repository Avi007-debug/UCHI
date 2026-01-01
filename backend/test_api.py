"""
UCHI Backend Test Suite
Run tests to verify API endpoints
"""

import requests
import json


BASE_URL = 'http://localhost:5000'


def test_health_check():
    """Test health check endpoint"""
    print("\n=== Testing Health Check ===")
    response = requests.get(f'{BASE_URL}/health')
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    assert response.status_code == 200
    assert response.json()['status'] == 'healthy'
    print("✅ Health check passed")


def test_upload_image():
    """Test image upload endpoint"""
    print("\n=== Testing Image Upload ===")
    
    # Create a dummy file for testing
    import io
    from PIL import Image
    
    # Create a simple test image
    img = Image.new('RGB', (100, 100), color='green')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    files = {'file': ('test_image.jpg', img_bytes, 'image/jpeg')}
    data = {
        'area_type': 'RVCE',
        'sub_region': 'Campus',
        'date': '2026-01-01'
    }
    
    response = requests.post(f'{BASE_URL}/upload-image', files=files, data=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    assert response.status_code == 201
    assert 'chiValue' in response.json()
    print("✅ Image upload passed")


def test_get_results():
    """Test get results endpoint"""
    print("\n=== Testing Get Results ===")
    response = requests.get(f'{BASE_URL}/get-results')
    print(f"Status Code: {response.status_code}")
    results = response.json()
    print(f"Number of results: {len(results)}")
    if results:
        print(f"Sample result: {json.dumps(results[0], indent=2)}")
    assert response.status_code == 200
    print("✅ Get results passed")


def test_bangalore_summary():
    """Test Bangalore summary endpoint"""
    print("\n=== Testing Bangalore Summary ===")
    response = requests.get(f'{BASE_URL}/get-bangalore-summary')
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    assert response.status_code == 200
    assert 'overallCHI' in response.json()
    print("✅ Bangalore summary passed")


def test_rvce_results():
    """Test RVCE results endpoint"""
    print("\n=== Testing RVCE Results ===")
    response = requests.get(f'{BASE_URL}/get-rvce-results')
    print(f"Status Code: {response.status_code}")
    results = response.json()
    print(f"Number of regions: {len(results)}")
    for result in results:
        print(f"  - {result['region']}: CHI {result['chiValue']} ({result['status']})")
    assert response.status_code == 200
    assert len(results) > 0
    print("✅ RVCE results passed")


def test_temporal_comparison():
    """Test temporal comparison endpoint"""
    print("\n=== Testing Temporal Comparison ===")
    region = 'Campus'
    response = requests.get(f'{BASE_URL}/compare/{region}')
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    assert response.status_code == 200
    assert 'oldCHI' in response.json()
    assert 'newCHI' in response.json()
    print("✅ Temporal comparison passed")


if __name__ == '__main__':
    print("=" * 60)
    print("UCHI Backend API Tests")
    print("=" * 60)
    print("Make sure the backend server is running on localhost:5000")
    print("Start server with: python app.py")
    print("=" * 60)
    
    try:
        test_health_check()
        # test_upload_image()  # Uncomment when PIL is installed
        test_get_results()
        test_bangalore_summary()
        test_rvce_results()
        test_temporal_comparison()
        
        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
        
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
    except requests.exceptions.ConnectionError:
        print("\n❌ Could not connect to server. Is it running?")
    except Exception as e:
        print(f"\n❌ Error: {e}")
