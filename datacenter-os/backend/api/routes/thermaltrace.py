from fastapi import APIRouter
from api.models.schemas import ThermalSnapshotResponse, PredictRequest
import random

router = APIRouter(prefix="/api/thermaltrace", tags=["thermaltrace"])

@router.get("/snapshot", response_model=ThermalSnapshotResponse)
async def get_snapshot():
    grid = []
    for r in range(8):
         row_data = []
         for c in range(8):
             inlet = 22 + random.random()*5
             row_data.append({"row": r, "col": c, "inlet_temp": inlet, "outlet_temp": inlet + 10})
         grid.append(row_data)
    
    return {"grid": grid, "is_live": False}

@router.post("/predict", response_model=ThermalSnapshotResponse)
async def predict(req: PredictRequest):
    # TODO: Replace mock with LSTM model.
    # model = load_model('thermaltrace_lstm.h5')
    # prediction = model.predict(np.array(snapshots))
    # This is the drop-in point for the real model.
    grid = []
    for r in range(8):
         row_data = []
         for c in range(8):
             inlet = 25 + random.random()*7
             row_data.append({"row": r, "col": c, "inlet_temp": inlet, "outlet_temp": inlet + 10})
         grid.append(row_data)
    
    return {"grid": grid, "is_live": False}
