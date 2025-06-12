import google.generativeai as genai
from typing import Dict, Any
from .base import BaseAssistant
import os
from dotenv import load_dotenv

load_dotenv()

class GeminiAssistant(BaseAssistant):
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    async def generate_response(self, prompt: str) -> Dict[str, Any]:
        response = self.model.generate_content(prompt)
        return {
            "response": response.text,
            "model": "gemini-2.0-flash"
        }

    async def stream_response(self, prompt: str):
        response = self.model.generate_content(prompt, stream=True)
        for chunk in response:
            yield chunk.text 