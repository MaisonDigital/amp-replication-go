from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import sys

from app.core.config import settings
from app.api.v1.api import api_router

logging.basicConfig(
    level=logging.INFO if settings.ENVIRONMENT == "production" else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Real Estate MLS Listings API",
    openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.DEBUG else None,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health_check():
    """Health check endpoint for load balancers and monitoring."""
    
    # Test database connection - just test the connection, no query
    db_status = "unhealthy"
    try:
        from app.core.database import get_db
        db = next(get_db())
        # If we can get a database connection, we're good
        db_status = "healthy"
        db.close()
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
    
    # Test Redis connection  
    redis_status = "not_configured"
    try:
        from app.core.database import get_redis
        redis_client = get_redis()
        if redis_client:
            redis_client.ping()
            redis_status = "healthy"
    except Exception as e:
        redis_status = "unhealthy"
        logger.error(f"Redis health check failed: {e}")
    
    health_status = {
        "status": "healthy" if db_status == "healthy" else "unhealthy",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "database": db_status,
        "redis": redis_status,
        "debug": settings.DEBUG
    }
    
    status_code = 200 if health_status["status"] == "healthy" else 503
    return JSONResponse(content=health_status, status_code=status_code)

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "docs_url": "/docs" if settings.DEBUG else "Not available in production",
        "api_url": settings.API_V1_STR,
        "health_url": "/health"
    }

@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Custom 404 handler."""
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not Found",
            "message": f"The endpoint {request.url.path} was not found",
            "available_endpoints": {
                "health": "/health",
                "api": settings.API_V1_STR,
                "docs": "/docs" if settings.DEBUG else "Not available"
            }
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """Custom 500 handler."""
    logger.error(f"Internal server error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred" if settings.ENVIRONMENT == "production" else str(exc)
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.API_PORT,
        reload=settings.DEBUG,
        log_level="debug" if settings.DEBUG else "info"
    )