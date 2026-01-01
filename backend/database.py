"""
Database module for UCHI
Handles all database operations using Supabase PostgreSQL
"""

from supabase import Client
from datetime import datetime
from typing import List, Dict, Optional
from supabase_client import get_supabase


class Database:
    """Database manager for UCHI application using Supabase"""
    
    def __init__(self):
        """Initialize database connection to Supabase"""
        self.supabase: Client = get_supabase()
    
    def is_connected(self) -> bool:
        """Check if Supabase client is accessible"""
        return self.supabase is not None
    
    def insert_image_metadata(
        self, 
        filename: str, 
        storage_path: str, 
        area_type: str, 
        sub_region: Optional[str], 
        date: str
    ) -> int:
        """
        Insert image metadata into Supabase
        
        Args:
            filename: Name of uploaded file
            storage_path: Path in Supabase Storage
            area_type: Bengaluru or RVCE
            sub_region: RVCE sub-region (optional)
            date: Date of image capture
            
        Returns:
            ID of inserted record
        """
        try:
            data = {
                'filename': filename,
                'storage_path': storage_path,
                'area_type': area_type,
                'sub_region': sub_region,
                'date': date,
                'uploaded_at': datetime.now().isoformat()
            }
            
            response = self.supabase.table('image_metadata').insert(data).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]['id']
            else:
                print(f"⚠️  No data returned from image_metadata insert")
                return -1
                
        except Exception as e:
            print(f"❌ Error inserting image metadata: {e}")
            return -1
    
    def insert_chi_result(
        self,
        image_id: int,
        area_type: str,
        sub_region: Optional[str],
        chi_value: float,
        status: str,
        interpretation: str,
        date: str,
        vegetation_coverage: float,
        healthy_vegetation: float,
        stressed_vegetation: float
    ) -> int:
        """
        Insert CHI result into Supabase
        
        Returns:
            ID of inserted record
        """
        try:
            data = {
                'image_id': image_id,
                'area_type': area_type,
                'sub_region': sub_region,
                'chi_value': chi_value,
                'status': status,
                'interpretation': interpretation,
                'date': date,
                'vegetation_coverage': vegetation_coverage,
                'healthy_vegetation': healthy_vegetation,
                'stressed_vegetation': stressed_vegetation
            }
            
            response = self.supabase.table('chi_results').insert(data).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]['id']
            else:
                print(f"⚠️  No data returned from chi_results insert")
                return -1
                
        except Exception as e:
            print(f"❌ Error inserting CHI result: {e}")
            return -1
    
    def get_all_results(self) -> List[Dict]:
        """Get all CHI results from Supabase"""
        try:
            response = self.supabase.table('chi_results').select('*').order('created_at', desc=True).execute()
            
            results = []
            for row in response.data:
                results.append({
                    'id': row['id'],
                    'imageId': row['image_id'],
                    'areaType': row['area_type'],
                    'subRegion': row['sub_region'],
                    'chiValue': row['chi_value'],
                    'status': row['status'],
                    'interpretation': row['interpretation'],
                    'date': row['date'],
                    'vegetationCoverage': row.get('vegetation_coverage'),
                    'healthyVegetation': row.get('healthy_vegetation'),
                    'stressedVegetation': row.get('stressed_vegetation')
                })
            
            return results
            
        except Exception as e:
            print(f"❌ Error fetching all results: {e}")
            return []
    
    def get_bangalore_summary(self) -> Dict:
        """Get Bengaluru summary statistics from Supabase"""
        try:
            # Get all Bengaluru results
            response = self.supabase.table('chi_results')\
                .select('chi_value, created_at')\
                .eq('area_type', 'Bengaluru')\
                .execute()
            
            if not response.data or len(response.data) == 0:
                return {
                    'avgCHI': 62.0,
                    'status': 'Good',
                    'trend': 'stable',
                    'lastUpdated': datetime.now().isoformat(),
                    'totalAnalyses': 0
                }
            
            # Calculate average
            chi_values = [row['chi_value'] for row in response.data]
            avg_chi = sum(chi_values) / len(chi_values)
            
            # Get status
            status = self._get_status_from_chi(avg_chi)
            
            # Simple trend calculation (compare last 2)
            trend = 'stable'
            if len(chi_values) >= 2:
                recent = chi_values[0]
                previous = chi_values[1]
                if recent > previous + 2:
                    trend = 'improving'
                elif recent < previous - 2:
                    trend = 'declining'
            
            # Get last update time
            last_updated = response.data[0]['created_at']
            
            return {
                'avgCHI': round(avg_chi, 2),
                'status': status,
                'trend': trend,
                'lastUpdated': last_updated,
                'totalAnalyses': len(response.data)
            }
            
        except Exception as e:
            print(f"❌ Error fetching Bangalore summary: {e}")
            return {
                'avgCHI': 62.0,
                'status': 'Good',
                'trend': 'stable',
                'lastUpdated': datetime.now().isoformat(),
                'totalAnalyses': 0
            }
    
    def get_rvce_results(self) -> List[Dict]:
        """Get RVCE region-wise results from Supabase"""
        try:
            response = self.supabase.table('chi_results')\
                .select('*')\
                .eq('area_type', 'RVCE')\
                .order('created_at', desc=True)\
                .execute()
            
            # Group by sub_region
            regions = {}
            for row in response.data:
                region = row['sub_region'] or 'Unknown'
                if region not in regions:
                    regions[region] = []
                regions[region].append(row['chi_value'])
            
            # Calculate averages
            results = []
            for region, chi_values in regions.items():
                avg_chi = sum(chi_values) / len(chi_values)
                status = self._get_status_from_chi(avg_chi)
                
                results.append({
                    'region': region,
                    'avgCHI': round(avg_chi, 2),
                    'status': status,
                    'analyses': len(chi_values)
                })
            
            return results
            
        except Exception as e:
            print(f"❌ Error fetching RVCE results: {e}")
            return []
    
    def get_temporal_comparison(self, region: str) -> List[Dict]:
        """Get temporal CHI data for a specific region"""
        try:
            # Determine if it's RVCE sub-region or Bengaluru
            if region == 'Bengaluru':
                response = self.supabase.table('chi_results')\
                    .select('chi_value, date, created_at')\
                    .eq('area_type', 'Bengaluru')\
                    .order('date', desc=True)\
                    .limit(10)\
                    .execute()
            else:
                response = self.supabase.table('chi_results')\
                    .select('chi_value, date, created_at')\
                    .eq('area_type', 'RVCE')\
                    .eq('sub_region', region)\
                    .order('date', desc=True)\
                    .limit(10)\
                    .execute()
            
            results = []
            for row in response.data:
                results.append({
                    'date': row['date'],
                    'chiValue': row['chi_value'],
                    'timestamp': row['created_at']
                })
            
            return results
            
        except Exception as e:
            print(f"❌ Error fetching temporal comparison for {region}: {e}")
            return []
    
    def _get_status_from_chi(self, chi_value: float) -> str:
        """Determine status from CHI value"""
        if chi_value >= 75:
            return 'Excellent'
        elif chi_value >= 60:
            return 'Good'
        elif chi_value >= 45:
            return 'Moderate'
        elif chi_value >= 30:
            return 'Poor'
        else:
            return 'Critical'
