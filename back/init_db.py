import asyncio
from database import engine, Base
from app.models import Task

async def init():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(init())
