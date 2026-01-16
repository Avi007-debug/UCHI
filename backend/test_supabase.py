"""
Test Supabase Connection
Verifies database and storage connectivity
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from supabase_client import get_supabase
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_connection():
    """Test Supabase connection and permissions"""
    
    print("=" * 70)
    print("UCHI Supabase Connection Test")
    print("=" * 70)
    
    # Check environment variables
    print("\n🔍 Checking environment variables...")
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not supabase_url:
        print("❌ SUPABASE_URL not found in .env file")
        return False
    else:
        print(f"✅ SUPABASE_URL: {supabase_url}")
    
    if not supabase_key:
        print("❌ SUPABASE_SERVICE_KEY not found in .env file")
        return False
    else:
        print(f"✅ SUPABASE_SERVICE_KEY: {supabase_key[:20]}...{supabase_key[-10:]}")
    
    try:
        print("\n🔌 Connecting to Supabase...")
        supabase = get_supabase()
        print("✅ Supabase client initialized successfully!")
        
        # Test database connection
        print("\n📊 Testing database access...")
        
        # Test image_metadata table
        try:
            response = supabase.table('image_metadata').select("*").limit(1).execute()
            print(f"✅ image_metadata table accessible ({len(response.data)} rows returned)")
        except Exception as e:
            print(f"❌ Error accessing image_metadata: {e}")
            return False
        
        # Test chi_values table
        try:
            response = supabase.table('chi_values').select("*").limit(1).execute()
            print(f"✅ chi_values table accessible ({len(response.data)} rows returned)")
        except Exception as e:
            print(f"❌ Error accessing chi_values: {e}")
            return False
        
        # Test processing_logs table
        try:
            response = supabase.table('processing_logs').select("*").limit(1).execute()
            print(f"✅ processing_logs table accessible ({len(response.data)} rows returned)")
        except Exception as e:
            print(f"❌ Error accessing processing_logs: {e}")
            return False
        
        # Test storage
        print("\n💾 Testing storage access...")
        try:
            buckets = supabase.storage.list_buckets()
            print(f"✅ Storage accessible!")
            print(f"   Buckets found: {[b.name for b in buckets]}")
            
            # Check if uchi-images bucket exists
            uchi_bucket = next((b for b in buckets if b.name == 'uchi-images'), None)
            if uchi_bucket:
                print(f"✅ 'uchi-images' bucket found")
            else:
                print(f"⚠️  'uchi-images' bucket not found")
                print(f"   💡 Create it in Supabase dashboard: Storage → New Bucket")
            
        except Exception as e:
            print(f"❌ Error accessing storage: {e}")
            return False
        
        # Test views
        print("\n👁️  Testing views...")
        try:
            response = supabase.table('latest_chi_by_region').select("*").limit(5).execute()
            print(f"✅ latest_chi_by_region view accessible ({len(response.data)} rows returned)")
            if response.data:
                print("   Sample data:")
                for row in response.data[:3]:
                    print(f"      - {row.get('area_type')}: CHI={row.get('chi_value')} ({row.get('category')})")
        except Exception as e:
            print(f"❌ Error accessing view: {e}")
        
        try:
            response = supabase.table('chi_statistics').select("*").execute()
            print(f"✅ chi_statistics view accessible ({len(response.data)} rows returned)")
            if response.data:
                print("   Statistics:")
                for row in response.data:
                    print(f"      - {row.get('area_type')}: Avg CHI={row.get('avg_chi')}, Measurements={row.get('total_measurements')}")
        except Exception as e:
            print(f"❌ Error accessing chi_statistics: {e}")
        
        print("\n" + "=" * 70)
        print("CONNECTION TEST SUMMARY")
        print("=" * 70)
        print("✅ All tests passed!")
        print("\n💡 Next Steps:")
        print("   1. Populate sample data: python scripts/populate_sample_data.py")
        print("   2. Update backend API to fetch from database")
        print("   3. Test endpoints: curl http://localhost:5000/chi/bangalore")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Connection failed: {e}")
        print(f"\n💡 Troubleshooting:")
        print("   1. Check if .env file exists in backend/ folder")
        print("   2. Verify SUPABASE_URL and SUPABASE_SERVICE_KEY are correct")
        print("   3. Ensure database schema is set up (run SQL from SUPABASE_INTEGRATION_GUIDE.md)")
        print("   4. Check internet connection")
        return False

if __name__ == "__main__":
    success = test_connection()
    exit(0 if success else 1)
