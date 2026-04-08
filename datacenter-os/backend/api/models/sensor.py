from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

class SensorReading(BaseModel):
    timestamp: datetime
    value: float
    unit: str
    module: Literal["idlehunter", "waterwatch", "carbonclock", "thermaltrace", "noisemesh", "lightspeed"]
    sensor_id: str
    status: Literal["NORMAL", "ALERT", "CRITICAL"]

class ModuleStats(BaseModel):
    module_name: str
    is_active: bool
    current_pue: Optional[float]
    kpi: dict # Generic dictionary for specialized KPIs
