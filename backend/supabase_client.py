"""
Supabase Client Configuration
Handles connection to Supabase PostgreSQL and Storage
"""

from supabase import create_client, Client
from config import Config
import os


class SupabaseClient:
    """Singleton Supabase client"""
    
    _instance = None
    _client: Client = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SupabaseClient, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        """Initialize Supabase client using SERVICE_KEY for backend operations"""
        url = Config.SUPABASE_URL
        key = Config.SUPABASE_SERVICE_KEY  # Backend uses service key
        
        if not url or url == 'YOUR_SUPABASE_URL':
            print("⚠️  WARNING: Supabase URL not configured!")
            print("   Set SUPABASE_URL environment variable in .env file")
        
        if not key or key == 'YOUR_SUPABASE_SERVICE_KEY':
            print("⚠️  WARNING: Supabase Service Key not configured!")
            print("   Set SUPABASE_SERVICE_KEY environment variable in .env file")
        
        try:
            self._client = create_client(url, key)
            print("✅ Supabase client initialized successfully")
        except Exception as e:
            print(f"❌ Failed to initialize Supabase client: {e}")
            self._client = None
    
    @property
    def client(self) -> Client:
        """Get Supabase client instance"""
        return self._client
    
    def is_connected(self) -> bool:
        """Check if Supabase client is properly initialized"""
        return self._client is not None


# Global instance
supabase_client = SupabaseClient()


def get_supabase() -> Client:
    """Get Supabase client instance"""
    return supabase_client.client
