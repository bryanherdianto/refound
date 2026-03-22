from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket
from starlette.middleware.cors import CORSMiddleware
from starlette.types import ASGIApp, Scope, Receive, Send

from config import get_settings
from database import connect_db, close_db
from services.scheduler import start_scheduler, stop_scheduler

from routers import items, donate, claim, admin, tracking, esp32
from websocket.esp32 import esp32_websocket_endpoint


# ---------------------------------------------------------------------------
# Custom CORS middleware that skips WebSocket connections
# ---------------------------------------------------------------------------
class CORSMiddlewareSkipWS:
    """
    Wraps Starlette CORSMiddleware but lets WebSocket connections bypass
    CORS checks entirely. Without this the ESP32 gets a 403 because it
    sends no Origin header, which CORSMiddleware rejects.
    """

    def __init__(self, app: ASGIApp, **kwargs):
        self.app = app
        self.cors = CORSMiddleware(app, **kwargs)

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] == "websocket":
            # Skip CORS entirely for WS — go straight to the app
            await self.app(scope, receive, send)
        else:
            await self.cors(scope, receive, send)


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle events."""
    await connect_db()
    start_scheduler()
    print("ReFound Backend is ready!")
    yield
    stop_scheduler()
    await close_db()


app = FastAPI(
    title="ReFound API",
    description="Backend for the ReFound donation platform - connecting donors, donees, and IoT devices.",
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS (skips WebSocket connections)
# ---------------------------------------------------------------------------
settings = get_settings()
app.add_middleware(
    CORSMiddlewareSkipWS,
    allow_origins=["*"],
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
app.include_router(esp32.router)


# ---------------------------------------------------------------------------
# WebSocket
# ---------------------------------------------------------------------------
@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
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
