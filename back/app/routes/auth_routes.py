from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user_schemas import UserLogin, Token, UserCreate
from app.auth import verify_password, create_access_token
from app import crud
from app.deps import get_db

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

@auth_router.post("/login", response_model=Token)
async def login(user_login: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user_by_username(db, user_login.username)
    if not user or not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect credentials")

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@auth_router.post("/signup", response_model=Token)
async def signup(user_create: UserCreate, db: AsyncSession = Depends(get_db)):
    user = await crud.create_user(db, user_create)
    if not user:
        raise HTTPException(status_code=400, detail="Username already exists")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"} 