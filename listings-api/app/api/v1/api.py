from fastapi import APIRouter
from app.api.v1.endpoints import search, listings, media, featured

api_router = APIRouter()

api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(listings.router, prefix="/listings", tags=["listings"])
api_router.include_router(media.router, prefix="/media", tags=["media"])
api_router.include_router(featured.router, prefix="/featured", tags=["featured"])

@api_router.get("/status")
async def api_status():
    return {"status": "ok", "version": "1.0.0"}