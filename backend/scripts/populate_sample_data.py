"""
Populate Sample Data in Supabase
Creates sample CHI records for testing and demonstration
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from database import Database
from chi_generator import CHIGenerator
from datetime import datetime, timedelta
import random

def populate_sample_data():
    """Populate Supabase with sample CHI data"""
    
    print("=" * 70)
    print("UCHI Sample Data Population")
    print("=" * 70)
    
    try:
        db = Database()
        chi_gen = CHIGenerator()
        
        print("\n🔌 Testing database connection...")
        if not db.is_connected():
            print("❌ Failed to connect to Supabase")
            print("💡 Check your .env file for SUPABASE_URL and SUPABASE_SERVICE_KEY")
            return False
        
        print("✅ Connected to Supabase successfully!")
        
        # Generate sample data for Bengaluru
        print("\n📊 Generating Bengaluru data...")
        bangalore_data = []
        base_chi = 62.5
        
        for i in range(12):  # 12 months of data
            date = datetime.now() - timedelta(days=i*30)
            # Add seasonal variation
            seasonal_variation = random.uniform(-3, 7)
            chi = max(0, min(100, base_chi + seasonal_variation))
            
            # Insert metadata
            image_id = db.insert_image_metadata(
                filename=f"bangalore_sample_{i}.jpg",
                storage_path=f"bangalore/raw/sample_{i}.jpg",
                area_type="Bengaluru",
                sub_region=None,
                date=date.strftime('%Y-%m-%d')
            )
            
            # Insert CHI value
            category = chi_gen.get_status(chi)
            db.insert_chi_value(
                image_id=image_id,
                area_type="Bengaluru",
                sub_region=None,
                chi_value=round(chi, 2),
                category=category,
                vegetation_percentage=round(chi * 0.85, 2)
            )
            
            bangalore_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'chi': round(chi, 2),
                'category': category
            })
            
            print(f"   ✅ {i+1}/12: CHI={chi:.2f} ({category}) on {date.strftime('%Y-%m-%d')}")
        
        # Generate sample data for RVCE
        print("\n📊 Generating RVCE data...")
        rvce_subregions = [
            ("Sports Ground", 78.2),
            ("Campus Buildings", 65.8),
            ("Parking", 45.3),
            ("Hostel", 71.5)
        ]
        
        for sub_region, base_chi in rvce_subregions:
            print(f"\n   🏫 {sub_region}")
            for i in range(6):  # 6 data points per sub-region
                date = datetime.now() - timedelta(days=i*45)
                chi = max(0, min(100, base_chi + random.uniform(-5, 5)))
                
                # Insert metadata
                image_id = db.insert_image_metadata(
                    filename=f"rvce_{sub_region.lower().replace(' ', '_')}_sample_{i}.jpg",
                    storage_path=f"rvce/{sub_region.lower().replace(' ', '_')}/sample_{i}.jpg",
                    area_type="RVCE",
                    sub_region=sub_region,
                    date=date.strftime('%Y-%m-%d')
                )
                
                # Insert CHI value
                category = chi_gen.get_status(chi)
                db.insert_chi_value(
                    image_id=image_id,
                    area_type="RVCE",
                    sub_region=sub_region,
                    chi_value=round(chi, 2),
                    category=category,
                    vegetation_percentage=round(chi * 0.85, 2)
                )
                
                print(f"      ✅ {i+1}/6: CHI={chi:.2f} ({category})")
        
        # Calculate averages
        avg_bangalore = sum(d['chi'] for d in bangalore_data) / len(bangalore_data)
        
        print("\n" + "=" * 70)
        print("SUMMARY")
        print("=" * 70)
        print(f"✅ Bengaluru: {len(bangalore_data)} records (Avg CHI: {avg_bangalore:.2f})")
        print(f"✅ RVCE: {len(rvce_subregions) * 6} records across 4 sub-regions")
        print(f"📊 Total: {len(bangalore_data) + len(rvce_subregions) * 6} records")
        
        print("\n🎉 Sample data populated successfully!")
        print("\n💡 Next Steps:")
        print("   1. Verify data in Supabase dashboard")
        print("   2. Test API: curl http://localhost:5000/chi/bangalore")
        print("   3. Start frontend: npm run dev")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print(f"\n💡 Troubleshooting:")
        print("   1. Check if Supabase tables exist (run SQL schema)")
        print("   2. Verify .env file has correct credentials")
        print("   3. Check database.py for errors")
        return False

if __name__ == "__main__":
    success = populate_sample_data()
    exit(0 if success else 1)
