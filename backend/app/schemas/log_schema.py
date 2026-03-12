from pydantic import BaseModel
from typing import Optional

class TelemetryLog(BaseModel):
    model_name: str
    provider: str
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    latency_ms: float
    cost_usd: float
    status: str
    groundedness_score: Optional[float] = None
    retrieval_score: Optional[float] = None