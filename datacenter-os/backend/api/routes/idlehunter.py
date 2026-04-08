from fastapi import APIRouter
from typing import List
from ..models.sensor import SensorReading

router = APIRouter(prefix="/idlehunter", tags=["IDLEhunter"])

@router.get("/status")
async def get_idlehunter_status():
    return {
        "module_name": "IDLEhunter",
        "is_active": True,
        "nodes_monitoring": 1420,
        "zombie_nodes_detected": 42
    }

@router.get("/sensors", response_model=List[SensorReading])
async def get_idlehunter_sensors():
    # Placeholder for live sensor stream
    return []
