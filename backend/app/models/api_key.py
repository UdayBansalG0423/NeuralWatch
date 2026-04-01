from sqlalchemy import Column, String, Boolean, ForeignKey
from app.db.base import Base
import uuid


class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    key = Column(String, nullable=False)
    tenant_id = Column(String, ForeignKey("tenants.id"))
    is_active = Column(Boolean, default=True)