from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers.routes import router as routes_router

Base.metadata.create_all(engine)

app = FastAPI(title="Swiftly Road Disruption Intelligence API")

# Expo Web runs the app in a browser, which sends a CORS preflight (OPTIONS)
# before any request carrying Content-Type: application/json. Without this the
# preflight 405s and the browser blocks the real call. Expo Go on a device does
# not preflight, so this only matters for the web target.
# NOTE: allow_origins=["*"] is for local development only — restrict it before
# deploying anywhere public.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_router)


@app.get("/health")
def health():
    return {"status": "ok"}
