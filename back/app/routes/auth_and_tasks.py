from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import TaskCreate, Task, UserLogin, TaskRead, Token, UserCreate
from app.auth import verify_password, create_access_token
from app import crud
from app.deps import get_db, get_current_user
from typing import List

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/create", response_model=Task)
async def create_task(
    task: TaskCreate,
    db: AsyncSession = Depends(get_db),
    user = Depends(get_current_user)
):
    return await crud.create_task(db, task, user)


@router.get("/get_all", response_model=List[Task])
async def get_tasks(db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
    return await crud.get_user_tasks(db, user)


@router.get("/", response_model=List[TaskRead])
async def read_all(db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
    return await crud.get_user_tasks(db, user)


@router.delete("/delete/{task_id}", response_model=bool)
async def delete_task(task_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.delete_task(db, task_id)


@router.put("/update/{task_id}", response_model=Task)
async def update_task(task_id: int, task_data: TaskCreate, db: AsyncSession = Depends(get_db)):
    return await crud.update_task(db, task_id, task_data)


@router.post("/login", response_model=Token)
async def login(user_login: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user_by_username(db, user_login.username)
    if not user or not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect credentials")

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signup", response_model=Token)
async def signup(user_create: UserCreate, db: AsyncSession = Depends(get_db)):
    user = await crud.create_user(db, user_create)
    if not user:
        raise HTTPException(status_code=400, detail="Username already exists")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
