from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import Task as TaskModel
from app.models import User as UserModel
from app.schemas import TaskCreate
from app.auth import hash_password
from app.schemas import UserCreate

async def create_task(db: AsyncSession, task_data: TaskCreate, user: UserModel):
    task = TaskModel(**task_data.dict(), user_id=user.id)
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

async def get_user_tasks(db: AsyncSession, user: UserModel):
    result = await db.execute(select(TaskModel).filter(TaskModel.user_id == user.id))
    return result.scalars().all()

async def get_user_by_username(db: AsyncSession, username: str):
    result = await db.execute(select(UserModel).filter(UserModel.username == username))
    return result.scalars().first()

async def create_user(db: AsyncSession, user_data: UserCreate):
    result = await db.execute(select(UserModel).filter(UserModel.username == user_data.username))
    existing_user = result.scalars().first()
    if existing_user:
        return None
    hashed_pw = hash_password(user_data.password)
    user = UserModel(username=user_data.username, hashed_password=hashed_pw)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
