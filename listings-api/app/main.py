from fastapi import FastAPI

app = FastAPI(title="Listings API", version="1.0.0")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

@app.get("/")
async def root():
    return {"message": "Listings API", "version": "1.0.0"}
