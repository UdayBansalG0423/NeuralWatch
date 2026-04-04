from fastapi import Header, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.api_key import APIKey


def get_tenant_from_api_key(x_api_key: str = Header(...)):
    db: Session = SessionLocal()

    try:
        api_key = db.query(APIKey).filter(
            APIKey.key == x_api_key,
            APIKey.is_active == True
        ).first()

        if not api_key:
            raise HTTPException(status_code=401, detail="Invalid API Key")

        return api_key.tenant_id
    finally:
        db.close()