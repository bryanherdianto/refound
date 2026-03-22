from datetime import datetime, timedelta

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from database import get_items_collection

scheduler = AsyncIOScheduler()


async def expire_stale_items():
    """
    Cron job: find items that are AVAILABLE and older than 7 days,
    then update their status to EXPIRED.
    """
    collection = get_items_collection()
    cutoff = datetime.utcnow() - timedelta(days=7)

    result = await collection.update_many(
        {
            "status": "available",
            "detected_at": {"$lt": cutoff},
        },
        {"$set": {"status": "expired"}},
    )

    if result.modified_count > 0:
        print(f"Expired {result.modified_count} stale item(s)")


def start_scheduler():
    """Start the APScheduler cron job to run every hour."""
    scheduler.add_job(
        expire_stale_items,
        "interval",
        hours=1,
        id="expire_stale_items",
        replace_existing=True,
    )
    scheduler.start()
    print("Scheduler started - expiry check every hour")


def stop_scheduler():
    """Gracefully shut down the scheduler."""
    scheduler.shutdown(wait=False)
    print("Scheduler stopped")
