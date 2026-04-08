from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import carbonclock, hardware, thermaltrace
import uvicorn

app = FastAPI(title="DatacenterOS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(carbonclock.router)
app.include_router(hardware.router)
app.include_router(thermaltrace.router)

@app.get("/")
def read_root():
    return {"status": "DatacenterOS API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
