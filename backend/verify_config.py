"""
UCHI Configuration Verification Script
Run this to verify Supabase connection and configuration
"""

import os
import sys

print("=" * 60)
print("UCHI Configuration Verification")
print("=" * 60)
print()

# Check 1: Environment file
print("[1/5] Checking .env file...")
if os.path.exists('.env'):
    print("      ✅ .env file exists")
else:
    print("      ❌ .env file NOT FOUND!")
    print("      Create .env file with your Supabase credentials")
    sys.exit(1)

print()

# Check 2: Load environment variables
print("[2/5] Loading environment variables...")
from dotenv import load_dotenv
load_dotenv()

supabase_url = os.getenv('SUPABASE_URL')
supabase_service_key = os.getenv('SUPABASE_SERVICE_KEY')
# Fallback to SUPABASE_KEY for backward compatibility
if not supabase_service_key:
    supabase_service_key = os.getenv('SUPABASE_KEY')

if supabase_url and supabase_url != 'YOUR_SUPABASE_URL':
    print(f"      ✅ SUPABASE_URL: {supabase_url}")
else:
    print("      ❌ SUPABASE_URL not configured!")
    print("      Add SUPABASE_URL to your .env file")
    sys.exit(1)

if supabase_service_key and supabase_service_key not in ['YOUR_SUPABASE_SERVICE_KEY', 'YOUR_SUPABASE_ANON_KEY']:
    print(f"      ✅ SUPABASE_SERVICE_KEY: {supabase_service_key[:30]}...")
else:
    print("      ❌ SUPABASE_SERVICE_KEY not configured!")
    print("      Add SUPABASE_SERVICE_KEY to your .env file")
    sys.exit(1)

print()

# Check 3: Import dependencies
print("[3/5] Checking Python dependencies...")
try:
    import flask
    print("      ✅ Flask installed")
except ImportError:
    print("      ❌ Flask not installed")
    print("      Run: pip install Flask==3.0.0")
    sys.exit(1)

try:
    from flask_cors import CORS
    print("      ✅ flask-cors installed")
except ImportError:
    print("      ❌ flask-cors not installed")
    print("      Run: pip install flask-cors==4.0.0")
    sys.exit(1)

try:
    from supabase import create_client
    print("      ✅ supabase installed")
except ImportError:
    print("      ❌ supabase not installed")
    print("      Run: pip install supabase==2.3.4")
    sys.exit(1)

print()

# Check 4: Test Supabase connection
print("[4/5] Testing Supabase connection...")
try:
    supabase = create_client(supabase_url, supabase_service_key)
    print("      ✅ Supabase client created successfully")
    
    # Try a simple query
    try:
        result = supabase.table('image_metadata').select("*").limit(1).execute()
        print("      ✅ Database connection successful")
    except Exception as e:
        print(f"      ⚠️  Database query failed: {e}")
        print("      Make sure you ran the SQL schema in Supabase")
        
except Exception as e:
    print(f"      ❌ Supabase connection failed: {e}")
    print("      Check your credentials in .env file")
    sys.exit(1)

print()

# Check 5: Verify storage bucket
print("[5/5] Checking storage bucket...")
try:
    buckets = supabase.storage.list_buckets()
    bucket_names = [b.name for b in buckets]
    
    if 'uchi-images' in bucket_names:
        print("      ✅ Storage bucket 'uchi-images' exists")
    else:
        print("      ⚠️  Storage bucket 'uchi-images' NOT FOUND")
        print("      Create bucket in Supabase: Storage → New bucket → 'uchi-images'")
except Exception as e:
    print(f"      ⚠️  Could not check storage: {e}")

print()
print("=" * 60)
print("✅ Configuration Verified - Ready to run!")
print("=" * 60)
print()
print("Start backend with: python app.py")
print()
