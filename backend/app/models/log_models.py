from sqlalchemy import Column, String, Integer, Float, DateTime
from datetime import datetime
from app.db.base import Base
import uuid


class RequestLog(Base):
    __tablename__ = "request_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, nullable=False)
    model_name = Column(String)
    provider = Column(String)
    prompt_tokens = Column(Integer)
    completion_tokens = Column(Integer)
    total_tokens = Column(Integer)
    latency_ms = Column(Float)
    cost_usd = Column(Float)
    status = Column(String)
    groundedness_score = Column(Float, nullable=True)
    retrieval_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
