from sqlalchemy import func
from app.models.log_models import RequestLog

class MetricsEngine:

    def __init__(self, db):
        self.db = db

    def get_overview(self):

        total_requests = self.db.query(func.count(RequestLog.id)).scalar()

        success_requests = self.db.query(func.count(RequestLog.id))\
            .filter(RequestLog.status == "success").scalar()

        avg_latency = self.db.query(func.avg(RequestLog.latency_ms)).scalar()

        total_cost = self.db.query(func.sum(RequestLog.cost_usd)).scalar()

        success_rate = success_requests / total_requests if total_requests else 0

        return {
            "total_requests": total_requests,
            "success_rate": success_rate,
            "avg_latency": avg_latency,
            "total_cost": total_cost
        }

    def get_latency_trend(self):

        results = (
            self.db.query(
                func.date(RequestLog.created_at).label("date"),
                func.avg(RequestLog.latency_ms).label("avg_latency")
            )
            .group_by(func.date(RequestLog.created_at))
            .order_by(func.date(RequestLog.created_at))
            .all()
        )

        return [
            {"date": str(r.date), "value": float(r.avg_latency)}
            for r in results
        ]
    
    def get_cost_trend(self):

        results = (
            self.db.query(
                func.date(RequestLog.created_at).label("date"),
                func.sum(RequestLog.cost_usd).label("total_cost")
            )
            .group_by(func.date(RequestLog.created_at))
            .order_by(func.date(RequestLog.created_at))
            .all()
        )

        return [
            {"date": str(r.date), "value": float(r.total_cost)}
            for r in results
        ]
    
    def get_reliability_score(self):

        total = self.db.query(func.count(RequestLog.id)).scalar()

        success = self.db.query(func.count(RequestLog.id))\
            .filter(RequestLog.status == "success").scalar()

        avg_latency = self.db.query(func.avg(RequestLog.latency_ms)).scalar()

        groundedness = self.db.query(func.avg(RequestLog.groundedness_score)).scalar()
        retrieval = self.db.query(func.avg(RequestLog.retrieval_score)).scalar()

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