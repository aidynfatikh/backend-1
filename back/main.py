from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.task_routes import router as task_router
from app.routes.assistant import router as assistant_router
from app.routes.auth_routes import auth_router

app = FastAPI(title="Todo API with PostgreSQL")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(task_router)
app.include_router(assistant_router)
app.include_router(auth_router)
