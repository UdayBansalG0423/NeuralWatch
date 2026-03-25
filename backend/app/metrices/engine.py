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

    def get_latency_metrics(self):
        pass

    def get_cost_metrics(self):
        pass

    def get_reliability_score(self):
        pass