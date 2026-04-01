from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.log_schema import TelemetryLog
from app.db.session import SessionLocal
from app.models.log_models import RequestLog
from app.metrices.engine import MetricsEngine
from app.core.auth import get_tenant_from_api_key

router = APIRouter(prefix="/log", tags=["telemetry"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def ingest_log(
    log: TelemetryLog,
    tenant_id: str = Depends(get_tenant_from_api_key),
    db: Session = Depends(get_db)
):

    new_log = RequestLog(**log.dict(), tenant_id=tenant_id)

    db.add(new_log)
    db.commit()

    return {"message": "log stored"}


@router.get("/overview")
def overview(
    tenant_id: str = Depends(get_tenant_from_api_key),
    db: Session = Depends(get_db)
):
    engine = MetricsEngine(db)
    return engine.get_overview(tenant_id)


@router.get("/reliability")
def reliability(
    tenant_id: str = Depends(get_tenant_from_api_key),
    db: Session = Depends(get_db)
):
    engine = MetricsEngine(db)
    return engine.get_reliability_score(tenant_id)

@router.get("/latency-trend")
def latency_trend(
    tenant_id: str = Depends(get_tenant_from_api_key),
    db: Session = Depends(get_db)
):
    engine = MetricsEngine(db)
    return engine.get_latency_trend(tenant_id)


@router.get("/cost-trend")
def cost_trend(
    tenant_id: str = Depends(get_tenant_from_api_key),
    db: Session = Depends(get_db)
):
    engine = MetricsEngine(db)
    return engine.get_cost_trend(tenant_id)
