import os
from typing import List, Optional


class Settings:
    APP_NAME: str = "Listings API"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # Database settings
    DATABASE_HOST: str = os.getenv("DATABASE_HOST", "localhost")
    DATABASE_PORT: int = int(os.getenv("DATABASE_PORT", "5432"))
    DATABASE_USER: str = os.getenv("DATABASE_USER", "postgres")
    DATABASE_PASSWORD: str = os.getenv("DATABASE_PASSWORD", "")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "postgres")
    
    # Redis settings
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    REDIS_PASSWORD: Optional[str] = os.getenv("REDIS_PASSWORD")
    
    # API settings
    API_V1_STR: str = "/api/v1"
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    
    # Pagination Settings
    PAGE_SIZE_DEFAULT: int = 20
    PAGE_SIZE_MAX: int = 100
    
    # Cache Settings (in seconds)
    CACHE_TTL_SECONDS: int = 300
    SEARCH_CACHE_TTL: int = 180
    
    # CORS Settings
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        # origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
        origins_str = "*"
        return [origin.strip() for origin in origins_str.split(",")]
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
    
    @property
    def REDIS_URL(self) -> str:
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"


settings = Settings()