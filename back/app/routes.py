from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import TaskCreate, Task
from app import crud
from app.deps import get_db
from typing import List

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/create", response_model=Task)
async def create_task(task: TaskCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_task(db, task)

@router.get("/get_all", response_model=List[Task])
async def get_tasks(db: AsyncSession = Depends(get_db)):
    return await crud.get_all_tasks(db)

@router.delete("/delete/{task_id}", response_model=bool)
async def delete_task(task_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.delete_task(db, task_id)

@router.put("/update/{task_id}", response_model=Task)
async def update_task(task_id: int, task_data: TaskCreate, db: AsyncSession = Depends(get_db)):
    return await crud.update_task(db, task_id, task_data)
