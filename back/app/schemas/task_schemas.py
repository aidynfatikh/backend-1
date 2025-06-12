from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    description: str

class TaskRead(BaseModel):
    id: int
    title: str
    description: str
    completed: bool

    class Config:
        orm_mode = True


class Task(BaseModel):
    id: int
    title: str
    description: str
    completed: bool

    class Config:
        orm_mode = True 