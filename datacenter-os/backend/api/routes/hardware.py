from fastapi import APIRouter
from api.models.schemas import HardwareCPUResponse, HardwareFlowResponse, HardwareNetworkNode
from typing import List

router = APIRouter(prefix="/api/hardware", tags=["hardware"])

@router.get("/cpu", response_model=HardwareCPUResponse)
async def get_cpu():
    # Proxy to Raspberry Pi inside a real environment
    return {
        "node": "pi-node-1",
        "usage": 8.3,
        "ram": 34.1,
        "temp": 47.2,
        "is_live": False
    }

@router.get("/flow", response_model=HardwareFlowResponse)
async def get_flow():
    return {
        "rack": "pi-rack",
        "flow_lph": 1240.0,
        "is_live": False
    }

@router.get("/network", response_model=List[HardwareNetworkNode])
async def get_network():
    return [
        {"node": "esp32_a", "rssi": -45, "is_live": False},
        {"node": "esp32_b", "rssi": -62, "is_live": False}
    ]
