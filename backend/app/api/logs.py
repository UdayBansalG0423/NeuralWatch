from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.log_schema import TelemetryLog
from app.db.session import SessionLocal
from app.models.log_models import RequestLog

router = APIRouter(prefix="/log", tags=["telemetry"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def ingest_log(log: TelemetryLog, db: Session = Depends(get_db)):

    new_log = RequestLog(**log.dict())

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return {"message": "log stored"}
