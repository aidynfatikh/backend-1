from celery import Celery
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "backend_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["app.tasks"] # We will create this file later for actual tasks
)

celery_app.conf.update(
    task_track_started=True,
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    timezone='UTC',
    enable_utc=True,
)

# Example task (you'll define real tasks in back/app/tasks.py)
@celery_app.task
def add(x, y):
    return x + y 