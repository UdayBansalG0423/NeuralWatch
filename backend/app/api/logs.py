from fastapi import APIRouter
from app.schemas.log_schema import TelemetryLog

router = APIRouter(prefix="/log", tags=["telemetry"])

@router.post("/")
def ingest_log(log: TelemetryLog):
    return {
        "message": "log received",
        "data": log
    }