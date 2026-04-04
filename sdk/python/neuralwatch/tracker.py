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
    prompt_tokens: int = None,
    completion_tokens: int = None,
):
    # Smart defaults: if not specified, split tokens 50/50
    if prompt_tokens is None:
        prompt_tokens = total_tokens // 2
    if completion_tokens is None:
        completion_tokens = total_tokens - prompt_tokens
    
    payload = {
        "model_name": model_name,
        "provider": provider,
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
        "total_tokens": total_tokens,
        "latency_ms": latency_ms,
        "cost_usd": cost_usd,
        "status": status,
        "groundedness_score": groundedness_score,
        "retrieval_score": retrieval_score,
    }

    return send_log(payload)