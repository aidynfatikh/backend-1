from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from ..assistant.gemini import GeminiAssistant

router = APIRouter(prefix="/assistant", tags=["assistant"])

class ChatRequest(BaseModel):
    prompt: str
    model: str = "gemini"  # Default to Gemini

def get_assistant(model: str):
    if model == "gemini":
        return GeminiAssistant()
    else:
        raise HTTPException(status_code=400, detail="Invalid model specified")

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        assistant = get_assistant(request.model)
        response = await assistant.generate_response(request.prompt)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    try:
        assistant = get_assistant(request.model)
        return StreamingResponse(
            assistant.stream_response(request.prompt),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 