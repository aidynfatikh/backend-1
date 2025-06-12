from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    description: str
    completed: Optional[bool] = None

class TaskRead(BaseModel):
    id: int
    title: str
    description: str
    completed: bool

    class Config:
        from_attributes = True


class Task(BaseModel):
    id: int
    title: str
    description: str
    completed: bool

    class Config:
        from_attributes = True 