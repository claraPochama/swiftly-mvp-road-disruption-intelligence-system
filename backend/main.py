from fastapi import FastAPI

from database import Base, engine
from routers.routes import router as routes_router

Base.metadata.create_all(engine)

app = FastAPI(title="Swiftly Road Disruption Intelligence API")
app.include_router(routes_router)


@app.get("/health")
def health():
    return {"status": "ok"}
