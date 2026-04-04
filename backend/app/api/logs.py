from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.schemas.log_schema import TelemetryLog
from app.db.session import SessionLocal
from app.models.log_models import RequestLog
from app.models.api_key import APIKey
from app.metrices.engine import MetricsEngine
from app.core.auth import get_tenant_from_api_key
from datetime import datetime, timedelta

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


@router.get("/quick-stats")
def quick_stats(
    tenant_id: str = Depends(get_tenant_from_api_key),
    db: Session = Depends(get_db)
):
    engine = MetricsEngine(db)
    return engine.get_quick_stats(tenant_id)


@router.get("/top-models")
def top_models(
    tenant_id: str = Depends(get_tenant_from_api_key),
    db: Session = Depends(get_db)
):
    engine = MetricsEngine(db)
    return engine.get_top_models(tenant_id)


@router.get("/recent-activity")
def recent_activity(
    tenant_id: str = Depends(get_tenant_from_api_key),
    db: Session = Depends(get_db)
):
    engine = MetricsEngine(db)
    return engine.get_recent_activity(tenant_id)


@router.get("/analytics")
def analytics(
    tenant_id: str = Depends(get_tenant_from_api_key),
    db: Session = Depends(get_db)
):
    engine = MetricsEngine(db)
    overview = engine.get_overview(tenant_id)
    quick_stats = engine.get_quick_stats(tenant_id)
    analytics_data = engine.get_analytics(tenant_id)

    return {
        "overview": overview,
        "quick_stats": quick_stats,
        **analytics_data,
    }


@router.get("/models")
def list_models(
    tenant_id: str = Depends(get_tenant_from_api_key),
    db: Session = Depends(get_db)
):
    """Get all unique models used by this tenant with their metrics"""
    models = db.query(
        RequestLog.model_name,
        RequestLog.provider,
        func.count().label("requests"),
        func.avg(RequestLog.latency_ms).label("avg_latency"),
        func.sum(
            (RequestLog.status == "success").cast(int)
        ) / func.count() * 100.0,
        func.max(RequestLog.created_at).label("last_used")
    ).filter(
        RequestLog.tenant_id == tenant_id
    ).group_by(
        RequestLog.model_name,
        RequestLog.provider
    ).all()
    
    result = []
    for model in models:
        result.append({
            "name": model[0],
            "provider": model[1],
            "requests": int(model[2]),
            "avg_latency": float(model[3]) if model[3] else 0,
            "success_rate": float(model[4]) if model[4] else 0,
            "last_used": model[5].isoformat() if model[5] else None,
            "status": "active" if model[2] > 0 else "offline"
        })
    
    return sorted(result, key=lambda x: x["requests"], reverse=True)


@router.get("/api-keys")
def list_api_keys(
    tenant_id: str = Depends(get_tenant_from_api_key),
    db: Session = Depends(get_db)
):
    """Get all API keys for this tenant"""
    keys = db.query(APIKey).filter(
        APIKey.tenant_id == tenant_id
    ).all()
    
    result = []
    for key in keys:
        # Mask the key for security
        parts = key.key.split("_")
        if len(parts) >= 3:
            masked = f"{parts[0]}_{parts[1]}_••••••••••••••••••••{parts[2][-4:]}"
        else:
            masked = key.key[:10] + "••••••••••"
        
        result.append({
            "id": key.id,
            "key": masked,
            "is_active": key.is_active,
            "created_at": key.key.split("_")[1][:8] if "_" in key.key else "unknown"
        })
    
    return result


@router.get("/alerts")
def list_alerts(
    tenant_id: str = Depends(get_tenant_from_api_key),
    db: Session = Depends(get_db)
):
    """Get recent alerts/anomalies for this tenant"""
    # Check for high latency issues in last 24 hours
    now = datetime.utcnow()
    yesterday = now - timedelta(days=1)
    
    alerts = []
    
    # High latency alert
    high_latency = db.query(func.count()).filter(
        and_(
            RequestLog.tenant_id == tenant_id,
            RequestLog.latency_ms > 500,
            RequestLog.created_at > yesterday
        )
    ).scalar()
    
    if high_latency > 5:
        alerts.append({
            "id": "latency_1",
            "type": "warning",
            "title": "High Latency Detected",
            "message": f"{high_latency} requests exceeded 500ms in the last 24 hours",
            "status": "active"
        })
    
    # High error rate alert
    total = db.query(func.count()).filter(
        and_(
            RequestLog.tenant_id == tenant_id,
            RequestLog.created_at > yesterday
        )
    ).scalar()
    
    errors = db.query(func.count()).filter(
        and_(
            RequestLog.tenant_id == tenant_id,
            RequestLog.status != "success",
            RequestLog.created_at > yesterday
        )
    ).scalar()
    
    if total > 0 and (errors / total) * 100 > 5:
        error_rate = (errors / total) * 100
        alerts.append({
            "id": "error_1",
            "type": "error",
            "title": "High Error Rate",
            "message": f"Error rate is {error_rate:.1f}% in the last 24 hours",
            "status": "active"
        })
    
    # If no alerts, return a success message
    if not alerts:
        alerts.append({
            "id": "info_1",
            "type": "info",
            "title": "System Healthy",
            "message": "No issues detected in the last 24 hours",
            "status": "resolved"
        })
    
    return alerts


@router.get("/settings")
def get_settings(
    tenant_id: str = Depends(get_tenant_from_api_key),
    db: Session = Depends(get_db)
):
    """Get user settings (minimal implementation)"""
    return {
        "tenant_id": tenant_id,
        "profile": {
            "first_name": "Admin",
            "last_name": "User",
            "email": f"admin@{tenant_id}.neuralwatch.io",
            "company": "NeuralWatch"
        },
        "preferences": {
            "email_digest": True,
            "weekly_reports": True,
            "timezone": "UTC",
            "currency": "USD"
        }
    }
