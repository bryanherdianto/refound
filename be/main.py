from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from database import connect_db, close_db
from services.scheduler import start_scheduler, stop_scheduler

from routers import items, donate, claim, admin, tracking
from websocket.esp32 import esp32_websocket_endpoint


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle events."""
    # Startup
    await connect_db()
    start_scheduler()
    print("ReFound Backend is ready!")
    yield
    # Shutdown
    stop_scheduler()
    await close_db()


app = FastAPI(
    title="ReFound API",
    description="Backend for the ReFound donation platform — connecting donors, donees, and IoT devices.",
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# REST Routers
# ---------------------------------------------------------------------------
app.include_router(items.router)
app.include_router(donate.router)
app.include_router(claim.router)
app.include_router(admin.router)
app.include_router(tracking.router)


# ---------------------------------------------------------------------------
# WebSocket
# ---------------------------------------------------------------------------
@app.websocket("/ws")
async def websocket_route(websocket):
    await esp32_websocket_endpoint(websocket)


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "ok",
        "service": "ReFound Backend",
        "version": "1.0.0",
    }
