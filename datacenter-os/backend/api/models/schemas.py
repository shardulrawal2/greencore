from pydantic import BaseModel
from typing import List, Optional

class CarbonIntensityResponse(BaseModel):
    carbon_intensity: int
    zone: str
    updated_at: str
    is_live: bool

class ThermalCell(BaseModel):
    row: int
    col: int
    inlet_temp: float
    outlet_temp: float

class ThermalSnapshotResponse(BaseModel):
    grid: List[List[ThermalCell]]
    is_live: bool

class PredictRequest(BaseModel):
    snapshots: List[List[List[ThermalCell]]]

class HardwareCPUResponse(BaseModel):
    node: str
    usage: float
    ram: float
    temp: float
    is_live: bool

class HardwareFlowResponse(BaseModel):
    rack: str
    flow_lph: float
    is_live: bool

class HardwareNetworkNode(BaseModel):
    node: str
    rssi: int
    is_live: bool
