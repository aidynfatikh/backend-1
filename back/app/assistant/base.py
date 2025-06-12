from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAssistant(ABC):
    @abstractmethod
    async def generate_response(self, prompt: str) -> Dict[str, Any]:
        """Generate a response from the AI assistant"""
        pass

    @abstractmethod
    async def stream_response(self, prompt: str):
        """Stream a response from the AI assistant"""
        pass 