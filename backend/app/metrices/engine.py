from datetime import datetime, timedelta
import calendar
from math import floor
from sqlalchemy import case, func
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

    def get_quick_stats(self, tenant_id: str):
        active_models = self.db.query(func.count(func.distinct(RequestLog.model_name)))\
            .filter(RequestLog.tenant_id == tenant_id).scalar() or 0

        avg_response_time = self.db.query(func.avg(RequestLog.latency_ms))\
            .filter(RequestLog.tenant_id == tenant_id).scalar() or 0

        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        tokens_last_hour = self.db.query(func.sum(RequestLog.total_tokens))\
            .filter(RequestLog.tenant_id == tenant_id)\
            .filter(RequestLog.created_at >= one_hour_ago)\
            .scalar() or 0

        total_requests = self.db.query(func.count(RequestLog.id))\
            .filter(RequestLog.tenant_id == tenant_id).scalar() or 0
        success_requests = self.db.query(func.count(RequestLog.id))\
            .filter(RequestLog.tenant_id == tenant_id)\
            .filter(RequestLog.status == "success").scalar() or 0

        uptime = (success_requests / total_requests * 100) if total_requests else 0

        return {
            "active_models": int(active_models),
            "avg_response_time": float(avg_response_time),
            "tokens_per_min": float(tokens_last_hour) / 60,
            "uptime": uptime,
        }

    def get_top_models(self, tenant_id: str, limit: int = 5):
        rows = (
            self.db.query(
                RequestLog.model_name.label("name"),
                RequestLog.provider.label("provider"),
                func.count(RequestLog.id).label("requests"),
                func.avg(RequestLog.latency_ms).label("avg_latency"),
                func.avg(
                    case((RequestLog.status == "success", 1), else_=0)
                ).label("success_rate"),
            )
            .filter(RequestLog.tenant_id == tenant_id)
            .group_by(RequestLog.model_name, RequestLog.provider)
            .order_by(func.count(RequestLog.id).desc())
            .limit(limit)
            .all()
        )

        return [
            {
                "name": r.name,
                "provider": r.provider,
                "requests": int(r.requests or 0),
                "avg_latency": float(r.avg_latency or 0),
                "success_rate": float((r.success_rate or 0) * 100),
            }
            for r in rows
        ]

    def get_recent_activity(self, tenant_id: str, limit: int = 8):
        rows = (
            self.db.query(
                RequestLog.model_name,
                RequestLog.provider,
                RequestLog.status,
                RequestLog.latency_ms,
                RequestLog.cost_usd,
                RequestLog.created_at,
            )
            .filter(RequestLog.tenant_id == tenant_id)
            .order_by(RequestLog.created_at.desc())
            .limit(limit)
            .all()
        )

        activities = []
        for r in rows:
            if r.status != "success":
                level = "error"
                message = f"{r.model_name} request failed"
            elif (r.latency_ms or 0) > 1000:
                level = "warning"
                message = f"{r.model_name} high latency ({int(r.latency_ms)}ms)"
            else:
                level = "success"
                message = f"{r.model_name} completed request"

            activities.append(
                {
                    "type": level,
                    "message": message,
                    "time": r.created_at.isoformat() if r.created_at else None,
                    "provider": r.provider,
                    "cost_usd": float(r.cost_usd or 0),
                }
            )

        return activities

    def _percentile(self, values, percentile: float):
        if not values:
            return 0.0

        ordered = sorted(values)
        index = (len(ordered) - 1) * percentile
        lower = floor(index)
        upper = min(lower + 1, len(ordered) - 1)
        weight = index - lower
        return ordered[lower] * (1 - weight) + ordered[upper] * weight

    def get_analytics(self, tenant_id: str, days: int = 7):
        start_date = datetime.utcnow().date() - timedelta(days=days - 1)

        request_rows = (
            self.db.query(
                func.date(RequestLog.created_at).label("date"),
                func.count(RequestLog.id).label("requests"),
            )
            .filter(RequestLog.tenant_id == tenant_id)
            .filter(func.date(RequestLog.created_at) >= start_date)
            .group_by(func.date(RequestLog.created_at))
            .order_by(func.date(RequestLog.created_at))
            .all()
        )

        request_map = {str(row.date): int(row.requests or 0) for row in request_rows}
        request_trend = []
        for offset in range(days):
            current_date = start_date + timedelta(days=offset)
            request_trend.append({
                "date": calendar.day_abbr[current_date.weekday()],
                "value": request_map.get(str(current_date), 0),
            })

        model_rows = (
            self.db.query(
                RequestLog.model_name.label("name"),
                func.count(RequestLog.id).label("value"),
            )
            .filter(RequestLog.tenant_id == tenant_id)
            .group_by(RequestLog.model_name)
            .order_by(func.count(RequestLog.id).desc())
            .all()
        )

        model_distribution = [
            {"name": row.name or "Unknown", "value": int(row.value or 0)}
            for row in model_rows[:4]
        ]

        if len(model_rows) > 4:
            other_value = sum(int(row.value or 0) for row in model_rows[4:])
            if other_value:
                model_distribution.append({"name": "Other", "value": other_value})

        token_totals = self.db.query(
            func.sum(RequestLog.prompt_tokens).label("prompt_tokens"),
            func.sum(RequestLog.completion_tokens).label("completion_tokens"),
            func.sum(RequestLog.total_tokens).label("total_tokens"),
        ).filter(RequestLog.tenant_id == tenant_id).first()

        prompt_tokens = int(token_totals.prompt_tokens or 0)
        completion_tokens = int(token_totals.completion_tokens or 0)
        total_tokens = int(token_totals.total_tokens or 0)

        if total_tokens <= 0:
            total_tokens = prompt_tokens + completion_tokens

        if total_tokens <= 0:
            token_usage = [
                {"name": "Input", "value": 0},
                {"name": "Output", "value": 0},
            ]
        else:
            token_usage = [
                {"name": "Input", "value": prompt_tokens or int(total_tokens * 0.65)},
                {"name": "Output", "value": completion_tokens or int(total_tokens * 0.35)},
            ]

        latency_rows = (
            self.db.query(RequestLog.latency_ms)
            .filter(RequestLog.tenant_id == tenant_id)
            .filter(RequestLog.latency_ms.isnot(None))
            .all()
        )
        latencies = [float(row[0]) for row in latency_rows if row[0] is not None]

        total_requests = len(latencies)
        avg_latency = sum(latencies) / total_requests if total_requests else 0

        performance_summary = {
            "p50_latency": round(self._percentile(latencies, 0.50), 2),
            "p95_latency": round(self._percentile(latencies, 0.95), 2),
            "p99_latency": round(self._percentile(latencies, 0.99), 2),
            "total_tokens": total_tokens,
            "avg_latency": round(avg_latency, 2),
        }

        return {
            "request_trend": request_trend,
            "model_distribution": model_distribution,
            "token_usage": token_usage,
            "performance_summary": performance_summary,
        }