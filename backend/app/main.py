from fastapi import FastAPI
from app.api import logs
from app.db.session import engine
from app.db.base import Base
from app.models import log_models
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.metrices.engine import MetricsEngine

# Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/analytics", tags=["analytics"])


app = FastAPI(title="Neural Watch API", version="1.0")
app.include_router(logs.router)

@app.get("/")
def root():
    return {"Status": "Neural Watch API is running!"}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/overview")
def overview(db: Session = Depends(get_db)):
    engine = MetricsEngine(db)
    return engine.get_overview()


@router.get("/reliability")
def reliability(db: Session = Depends(get_db)):
    engine = MetricsEngine(db)
    return engine.get_reliability_score()