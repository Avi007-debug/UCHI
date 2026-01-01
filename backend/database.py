"""
Database module for UCHI
Handles all database operations using SQLite
"""

import sqlite3
import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional


class Database:
    """Database manager for UCHI application"""
    
    def __init__(self, db_path: str):
        """
        Initialize database connection
        
        Args:
            db_path: Path to SQLite database file
        """
        self.db_path = db_path
        
        # Ensure data directory exists
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        
        # Initialize database schema
        self._init_schema()
    
    def _init_schema(self):
        """Create database tables if they don't exist"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Image metadata table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS image_metadata (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                filepath TEXT NOT NULL,
                area_type TEXT NOT NULL,
                sub_region TEXT,
                date TEXT NOT NULL,
                uploaded_at TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # CHI results table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chi_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                image_id INTEGER NOT NULL,
                area_type TEXT NOT NULL,
                sub_region TEXT,
                chi_value REAL NOT NULL,
                status TEXT NOT NULL,
                interpretation TEXT NOT NULL,
                date TEXT NOT NULL,
                vegetation_coverage REAL,
                healthy_vegetation REAL,
                stressed_vegetation REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (image_id) REFERENCES image_metadata(id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def is_connected(self) -> bool:
        """Check if database is accessible"""
        try:
            conn = sqlite3.connect(self.db_path)
            conn.close()
            return True
        except Exception:
            return False
    
    def insert_image_metadata(
        self, 
        filename: str, 
        filepath: str, 
        area_type: str, 
        sub_region: Optional[str], 
        date: str
    ) -> int:
        """
        Insert image metadata
        
        Args:
            filename: Name of uploaded file
            filepath: Path where file is stored
            area_type: Bengaluru or RVCE
            sub_region: RVCE sub-region (optional)
            date: Date of image capture
            
        Returns:
            ID of inserted record
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO image_metadata 
            (filename, filepath, area_type, sub_region, date, uploaded_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (filename, filepath, area_type, sub_region, date, datetime.now().isoformat()))
        
        image_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return image_id
    
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
        Insert CHI result
        
        Returns:
            ID of inserted record
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO chi_results 
            (image_id, area_type, sub_region, chi_value, status, interpretation, 
             date, vegetation_coverage, healthy_vegetation, stressed_vegetation)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (image_id, area_type, sub_region, chi_value, status, interpretation, 
              date, vegetation_coverage, healthy_vegetation, stressed_vegetation))
        
        result_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return result_id
    
    def get_all_results(self) -> List[Dict]:
        """Get all CHI results"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                id, image_id as imageId, area_type as areaType, 
                sub_region as subRegion, chi_value as chiValue, 
                status, interpretation, date,
                vegetation_coverage as vegetationCoverage,
                healthy_vegetation as healthyVegetation,
                stressed_vegetation as stressedVegetation
            FROM chi_results
            ORDER BY created_at DESC
        ''')
        
        results = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return results
    
    def get_bangalore_summary(self) -> Dict:
        """Get Bengaluru summary statistics"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get average CHI for Bengaluru
        cursor.execute('''
            SELECT 
                AVG(chi_value) as avg_chi,
                COUNT(*) as total,
                MAX(created_at) as last_updated
            FROM chi_results
            WHERE area_type = 'Bengaluru'
        ''')
        
        row = cursor.fetchone()
        avg_chi = row[0] if row[0] else 62  # Default if no data
        total = row[1] if row[1] else 0
        last_updated = row[2] if row[2] else datetime.now().isoformat()
        
        # Get status
        status = self._get_status_from_chi(avg_chi)
        
        # Calculate trend (simplified - comparing last 2 analyses)
        cursor.execute('''
            SELECT chi_value
            FROM chi_results
            WHERE area_type = 'Bengaluru'
            ORDER BY created_at DESC
            LIMIT 2
        ''')
        
        recent = cursor.fetchall()
        trend_direction = 'stable'
        trend_percentage = 0.0
        
        if len(recent) >= 2:
            change = recent[0][0] - recent[1][0]
            if change > 0:
                trend_direction = 'up'
            elif change < 0:
                trend_direction = 'down'
            trend_percentage = round((change / recent[1][0]) * 100, 1)
        
        conn.close()
        
        return {
            'overallCHI': round(avg_chi, 1),
            'status': status,
            'totalAnalyses': total,
            'lastUpdated': last_updated,
            'trendDirection': trend_direction,
            'trendPercentage': abs(trend_percentage)
        }
    
    def get_rvce_results(self) -> List[Dict]:
        """Get RVCE results grouped by region"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get latest result for each sub-region
        cursor.execute('''
            SELECT 
                sub_region as region,
                chi_value as chiValue,
                status,
                date as lastAnalyzed
            FROM chi_results
            WHERE area_type = 'RVCE' 
            AND sub_region IS NOT NULL
            AND id IN (
                SELECT MAX(id)
                FROM chi_results
                WHERE area_type = 'RVCE'
                GROUP BY sub_region
            )
            ORDER BY sub_region
        ''')
        
        results = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        # Ensure all regions are represented
        all_regions = ['Campus', 'Sports Ground', 'Parking', 'Hostel', 'Roadside']
        existing_regions = {r['region'] for r in results}
        
        for region in all_regions:
            if region not in existing_regions:
                # Add placeholder with dummy data
                from chi_generator import CHIGenerator
                chi_gen = CHIGenerator()
                chi = chi_gen.generate_chi(region)
                results.append({
                    'region': region,
                    'chiValue': chi,
                    'status': chi_gen.get_status(chi),
                    'lastAnalyzed': datetime.now().strftime('%Y-%m-%d')
                })
        
        return results
    
    def get_temporal_comparison(self, region: str) -> Optional[Dict]:
        """
        Get temporal comparison for a region
        
        Args:
            region: Region name
            
        Returns:
            Comparison dict or None if insufficient data
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Determine query based on region type
        if region == 'Bengaluru':
            cursor.execute('''
                SELECT chi_value, date
                FROM chi_results
                WHERE area_type = 'Bengaluru'
                ORDER BY created_at DESC
                LIMIT 2
            ''')
        else:
            cursor.execute('''
                SELECT chi_value, date
                FROM chi_results
                WHERE sub_region = ?
                ORDER BY created_at DESC
                LIMIT 2
            ''', (region,))
        
        results = cursor.fetchall()
        conn.close()
        
        if len(results) < 2:
            # Not enough data, return dummy comparison
            from chi_generator import CHIGenerator
            chi_gen = CHIGenerator()
            old_chi = chi_gen.generate_chi(region)
            new_chi = chi_gen.generate_chi(region)
            change = new_chi - old_chi
            
            return {
                'region': region,
                'oldCHI': old_chi,
                'oldDate': (datetime.now().replace(day=1)).strftime('%Y-%m-%d'),
                'newCHI': new_chi,
                'newDate': datetime.now().strftime('%Y-%m-%d'),
                'change': round(change, 2),
                'changePercentage': round((change / old_chi) * 100, 1),
                'direction': 'increase' if change > 0 else 'decrease' if change < 0 else 'stable'
            }
        
        new_chi, new_date = results[0]
        old_chi, old_date = results[1]
        change = new_chi - old_chi
        
        return {
            'region': region,
            'oldCHI': old_chi,
            'oldDate': old_date,
            'newCHI': new_chi,
            'newDate': new_date,
            'change': round(change, 2),
            'changePercentage': round((change / old_chi) * 100, 1),
            'direction': 'increase' if change > 0 else 'decrease' if change < 0 else 'stable'
        }
    
    def _get_status_from_chi(self, chi: float) -> str:
        """Get status category from CHI value"""
        if chi >= 75:
            return 'Excellent'
        elif chi >= 60:
            return 'Good'
        elif chi >= 45:
            return 'Moderate'
        elif chi >= 30:
            return 'Poor'
        else:
            return 'Critical'
