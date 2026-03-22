import io
import uuid
import asyncio
from functools import partial

import boto3
from fastapi import UploadFile

from config import get_settings


def _get_s3_client():
    settings = get_settings()
    return boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )


async def upload_image(file: UploadFile | None = None, image_bytes: bytes | None = None, prefix: str = "items") -> str:
    """
    Upload an image to S3 and return the public URL.

    Accepts either a FastAPI UploadFile or raw bytes.
    """
    settings = get_settings()
    s3 = _get_s3_client()
    bucket = settings.AWS_BUCKET_NAME

    # Determine file content
    if file is not None:
        content = await file.read()
        content_type = file.content_type or "image/jpeg"
    elif image_bytes is not None:
        content = image_bytes
        content_type = "image/jpeg"
    else:
        raise ValueError("Either file or image_bytes must be provided")

    # Generate unique key
    file_name = f"{prefix}/{uuid.uuid4().hex}.jpg"

    # Run blocking S3 upload in a thread
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(
        None,
        partial(
            s3.upload_fileobj,
            io.BytesIO(content),
            bucket,
            file_name,
            ExtraArgs={"ContentType": content_type},
        ),
    )

    url = f"https://{bucket}.s3.{settings.AWS_REGION}.amazonaws.com/{file_name}"
    return url


async def upload_image_bytes(image_bytes: bytes, prefix: str = "esp32") -> str:
    """Convenience wrapper to upload raw bytes from the ESP32 camera."""
    return await upload_image(image_bytes=image_bytes, prefix=prefix)
