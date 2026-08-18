"""Clerk JWT verification for protected routes.

The frontend obtains a session token via Clerk's `getToken()` and sends it as
`Authorization: Bearer <token>`. We verify that token's RS256 signature against
Clerk's JWKS, then confirm the user carries the `admin` role.

Only `/api/admin/*` uses this. Browsing, donating and claiming stay public.
"""

import time
from typing import Any, Optional

import httpx
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from config import get_settings

CLERK_API_BASE = "https://api.clerk.com/v1"

# JWKS is cached in-process; Clerk rotates keys rarely, so an hour is plenty.
_JWKS_TTL_SECONDS = 3600
_jwks_cache: dict[str, Any] = {}
_jwks_fetched_at: float = 0.0

# Bearer scheme. auto_error=False so we can return our own 401 message.
_bearer = HTTPBearer(auto_error=False)


async def _get_jwks() -> dict[str, Any]:
    """Fetch (and cache) Clerk's JWKS, authenticated with the secret key."""
    global _jwks_cache, _jwks_fetched_at

    if _jwks_cache and (time.time() - _jwks_fetched_at) < _JWKS_TTL_SECONDS:
        return _jwks_cache

    settings = get_settings()
    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.get(
            f"{CLERK_API_BASE}/jwks",
            headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"},
        )

    if res.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Could not reach Clerk to verify credentials",
        )

    _jwks_cache = res.json()
    _jwks_fetched_at = time.time()
    return _jwks_cache


async def _decode_token(token: str) -> dict[str, Any]:
    """Verify the token signature and expiry, returning its claims."""
    jwks = await _get_jwks()

    try:
        header = jwt.get_unverified_header(token)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Malformed authentication token")

    kid = header.get("kid")
    key_data = next((k for k in jwks.get("keys", []) if k.get("kid") == kid), None)
    if key_data is None:
        raise HTTPException(status_code=401, detail="Unknown token signing key")

    try:
        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key_data)
        # Clerk session tokens carry no `aud`, so audience checking is disabled.
        return jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired, please sign in again")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication token")


async def _fetch_user_role(user_id: str) -> Optional[str]:
    """Read `public_metadata.role` from Clerk's Backend API.

    Used when the session token carries no role claim, which is the default
    unless a custom claim has been configured in the Clerk dashboard.
    """
    settings = get_settings()
    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.get(
            f"{CLERK_API_BASE}/users/{user_id}",
            headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"},
        )

    if res.status_code != 200:
        return None

    return res.json().get("public_metadata", {}).get("role")


async def require_admin(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> str:
    """FastAPI dependency: allow only signed-in users with the `admin` role.

    Returns the Clerk user id so handlers can attribute the action if needed.
    """
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    claims = await _decode_token(credentials.credentials)

    user_id = claims.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token is missing a subject")

    # Fast path: a custom `metadata`/`role` claim configured in Clerk.
    role = claims.get("role") or (claims.get("metadata") or {}).get("role")
    if role is None:
        role = await _fetch_user_role(user_id)

    if role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return user_id
