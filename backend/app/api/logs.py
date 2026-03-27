from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.log_schema import TelemetryLog
from app.db.session import SessionLocal
from app.models.log_models import RequestLog
from app.db.session import SessionLocal
from app.metrices.engine import MetricsEngine
router = APIRouter(prefix="/log", tags=["telemetry"])

router = APIRouter(prefix="/analytics", tags=["analytics"])


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

@router.get("/overview")
def overview(db: Session = Depends(get_db)):
    engine = MetricsEngine(db)
    return engine.get_overview()


@router.get("/reliability")
def reliability(db: Session = Depends(get_db)):
    engine = MetricsEngine(db)
    return engine.get_reliability_score()

@router.get("/latency-trend")
def latency_trend(db: Session = Depends(get_db)):
    engine = MetricsEngine(db)
    return engine.get_latency_trend()


@router.get("/cost-trend")
def cost_trend(db: Session = Depends(get_db)):
    engine = MetricsEngine(db)
    return engine.get_cost_trend()
