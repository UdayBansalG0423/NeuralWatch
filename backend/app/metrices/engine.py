from sqlalchemy import func
from app.models.log_models import RequestLog

class MetricsEngine:

    def __init__(self, db):
        self.db = db

    def get_overview(self, tenant_id: str):

        total_requests = self.db.query(func.count(RequestLog.id))\
            .filter(RequestLog.tenant_id == tenant_id).scalar()

        success_requests = self.db.query(func.count(RequestLog.id))\
            .filter(RequestLog.status == "success")\
            .filter(RequestLog.tenant_id == tenant_id).scalar()

        avg_latency = self.db.query(func.avg(RequestLog.latency_ms))\
            .filter(RequestLog.tenant_id == tenant_id).scalar()

        total_cost = self.db.query(func.sum(RequestLog.cost_usd))\
            .filter(RequestLog.tenant_id == tenant_id).scalar()

        success_rate = success_requests / total_requests if total_requests else 0

        return {
            "total_requests": total_requests,
            "success_rate": success_rate,
            "avg_latency": avg_latency,
            "total_cost": total_cost
        }

    def get_latency_trend(self, tenant_id: str):

        results = (
            self.db.query(
                func.date(RequestLog.created_at).label("date"),
                func.avg(RequestLog.latency_ms).label("avg_latency")
            )
            .filter(RequestLog.tenant_id == tenant_id)
            .group_by(func.date(RequestLog.created_at))
            .order_by(func.date(RequestLog.created_at))
            .all()
        )

        return [
            {"date": str(r.date), "value": float(r.avg_latency)}
            for r in results
        ]
    
    def get_cost_trend(self, tenant_id: str):

        results = (
            self.db.query(
                func.date(RequestLog.created_at).label("date"),
                func.sum(RequestLog.cost_usd).label("total_cost")
            )
            .filter(RequestLog.tenant_id == tenant_id)
            .group_by(func.date(RequestLog.created_at))
            .order_by(func.date(RequestLog.created_at))
            .all()
        )

        return [
            {"date": str(r.date), "value": float(r.total_cost)}
            for r in results
        ]
    
    def get_reliability_score(self, tenant_id: str):

        total = self.db.query(func.count(RequestLog.id))\
            .filter(RequestLog.tenant_id == tenant_id).scalar()

        success = self.db.query(func.count(RequestLog.id))\
            .filter(RequestLog.status == "success")\
            .filter(RequestLog.tenant_id == tenant_id).scalar()

        avg_latency = self.db.query(func.avg(RequestLog.latency_ms))\
            .filter(RequestLog.tenant_id == tenant_id).scalar()

        groundedness = self.db.query(func.avg(RequestLog.groundedness_score))\
            .filter(RequestLog.tenant_id == tenant_id).scalar()
        retrieval = self.db.query(func.avg(RequestLog.retrieval_score))\
            .filter(RequestLog.tenant_id == tenant_id).scalar()

        success_rate = success / total if total else 0

        latency_threshold = 1000  # ms
        latency_score = max(0, 1 - (avg_latency or 0) / latency_threshold)

        reliability = (
            0.4 * success_rate +
            0.3 * latency_score +
            0.2 * (groundedness or 0) +
            0.1 * (retrieval or 0)
        )

        return {
            "reliability_score": reliability
        }