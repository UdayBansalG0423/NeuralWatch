from .client import send_log


def track(
    model_name: str,
    provider: str,
    latency_ms: float,
    total_tokens: int,
    cost_usd: float,
    status: str = "success",
    groundedness_score: float = None,
    retrieval_score: float = None,
):
    payload = {
        "model_name": model_name,
        "provider": provider,
        "latency_ms": latency_ms,
        "total_tokens": total_tokens,
        "cost_usd": cost_usd,
        "status": status,
        "groundedness_score": groundedness_score,
        "retrieval_score": retrieval_score,
    }

    return send_log(payload)