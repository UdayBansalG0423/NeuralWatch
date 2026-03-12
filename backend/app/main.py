from fastapi import FastAPI
from app.api import logs

app = FastAPI(title="Neural Watch API", version="1.0")
app.include_router(logs.router)

@app.get("/")
def root():
    return {"Status": "Neural Watch API is running!"}