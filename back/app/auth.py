from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
import os
import redis
from app.celery_worker import celery_app

# Redis client (for direct Redis interactions, e.g., token blacklisting)
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = redis.from_url(REDIS_URL)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        # Check if the token is blacklisted
        if redis_client.get(f"blacklist:{token}"):
            raise HTTPException(status_code=401, detail="Token blacklisted")

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")  # return user ID or email
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def blacklist_token(token: str, expires_delta: timedelta = None):
    expire_seconds = int((expires_delta or timedelta(minutes=15)).total_seconds())
    # Enqueue the token invalidation task to Celery
    celery_app.send_task('app.tasks.invalidate_token', args=[token, expire_seconds])
    # Optionally, you can also set it immediately in Redis for faster checks, though Celery will handle the persistence
    redis_client.setex(f"blacklist:{token}", expire_seconds, "blacklisted")
