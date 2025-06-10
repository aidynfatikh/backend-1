from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import SessionLocal
from app.auth import oauth2_scheme, SECRET_KEY, ALGORITHM
from app.models import User
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
from sqlalchemy.future import select
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    result = await db.execute(select(User).filter(User.username == username))
    user = result.scalars().first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user
