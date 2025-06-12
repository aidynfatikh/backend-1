from .celery_worker import celery_app
import time
from app import crud
from app.deps import get_db
from database import SessionLocal
from sqlalchemy.future import select
from app.models import Task
import redis
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = redis.from_url(REDIS_URL)

@celery_app.task
def process_user_registration(user_data: dict):
    # Simulate a long-running task, e.g., sending a welcome email, processing data
    print(f"Processing user registration for: {user_data.get('email')}")
    # Add your actual user registration logic here that you want to offload
    time.sleep(5)
    print("User registration processed!")

@celery_app.task
def process_task_creation(task_data: dict):
    with SessionLocal() as db:
        # Assuming task_data contains task_id and user_id after initial creation
        # In a real scenario, you might want to fetch the task by its ID and update its status
        # For simplicity, we'll just print and simulate work
        print(f"Processing task creation for task with title: {task_data.get('title')}")
        time.sleep(3) # Simulate some work
        # Here, you would update the task status in the database to 'completed' or 'processed'
        # For example:
        # db_task = db.query(Task).filter(Task.id == task_data['id']).first()
        # if db_task:
        #     db_task.task_status = "completed"
        #     db.commit()
        #     db.refresh(db_task)
        print(f"Task with title {task_data.get('title')} processed!")

@celery_app.task
def process_task_update(task_id: int, task_data: dict):
    with SessionLocal() as db:
        print(f"Processing task update for task ID: {task_id}")
        time.sleep(2) # Simulate some work
        # Similar to task creation, you'd fetch the task and update its status or other fields
        # db_task = db.query(Task).filter(Task.id == task_id).first()
        # if db_task:
        #     for key, value in task_data.items():
        #         setattr(db_task, key, value)
        #     db_task.task_status = "updated"
        #     db.commit()
        #     db.refresh(db_task)
        print(f"Task ID {task_id} updated!")

@celery_app.task
def invalidate_token(token: str, expire_seconds: int):
    print(f"Invalidating token: {token} for {expire_seconds} seconds")
    redis_client.setex(f"blacklist:{token}", expire_seconds, "blacklisted")
    print(f"Token {token} blacklisted in Redis.")