from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import Task as TaskModel
from app.schemas import TaskCreate

async def create_task(db: AsyncSession, task_data: TaskCreate):
    task = TaskModel(**task_data.dict())
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task

async def get_all_tasks(db: AsyncSession):
    result = await db.execute(select(TaskModel))
    return result.scalars().all()

async def delete_task(db: AsyncSession, task_id: int) -> bool:
    task = await db.get(TaskModel, task_id)
    if task:
        await db.delete(task)
        await db.commit()
        return True
    return False

async def update_task(db: AsyncSession, task_id: int, task_data: TaskCreate):
    task = await db.get(TaskModel, task_id)
    if task:
        for key, value in task_data.dict().items():
            setattr(task, key, value)
        await db.commit()
        await db.refresh(task)
        return task
    raise ValueError("Task not found")
