from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    APP_NAME: str = "Listings API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Database settings - will be overridden by environment variables
    DATABASE_HOST: str = "postgres"  # Docker service name
    DATABASE_PORT: int = 5432
    DATABASE_USER: str = "postgres"
    DATABASE_PASSWORD: str = ""  # Set via environment
    DATABASE_NAME: str = "trreb_listings"
    
    # Redis settings - will be overridden by environment variables  
    REDIS_HOST: str = "redis"  # Docker service name
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None
    
    # API settings
    API_V1_STR: str = "/api/v1"
    API_PORT: int = 8000
    
    # Pagination Settings
    PAGE_SIZE_DEFAULT: int = 20
    PAGE_SIZE_MAX: int = 100
    
    # Cache Settings (in seconds)
    CACHE_TTL_SECONDS: int = 300
    SEARCH_CACHE_TTL: int = 180
    
    # CORS Settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:8080",
    ]
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
    
    @property
    def REDIS_URL(self) -> str:
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()