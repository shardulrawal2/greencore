from fastapi import APIRouter
from api.models.schemas import CarbonIntensityResponse
import httpx
from datetime import datetime

router = APIRouter(prefix="/api/carbonclock", tags=["carbonclock"])

cache = {
    "data": None,
    "timestamp": 0
}

@router.get("/intensity", response_model=CarbonIntensityResponse)
async def get_intensity():
    now = datetime.now().timestamp()
    if cache["data"] and now - cache["timestamp"] < 300:
        return cache["data"]
        
    try:
        async with httpx.AsyncClient() as client:
            # We don't have a real API key provided so this will likely fail
            # Reverting mock
            cache["data"] = {
                "carbon_intensity": 285,
                "zone": "IN-SO (Mock)",
                "updated_at": datetime.now().isoformat(),
                "is_live": False
            }
            cache["timestamp"] = now
            return cache["data"]
    except Exception:
        return {
            "carbon_intensity": 285,
            "zone": "IN-SO (Mock)",
            "updated_at": datetime.now().isoformat(),
            "is_live": False
        }
