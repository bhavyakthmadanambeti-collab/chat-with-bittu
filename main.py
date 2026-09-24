import os
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models import ChatRequest, ChatResponse, Message

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

app = FastAPI(title="ChatGPT-Style Starter API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


def demo_answer(user_text: str) -> str:
    return (
        "Demo mode is working. You asked: "
        f'"{user_text}"\n\n'
        "This starter is ready to connect to a real LLM through the "
        "LLM_MODE=api configuration in backend/.env."
    )


async def api_answer(messages: list[Message]) -> str:
    api_key = os.getenv("LLM_API_KEY", "")
    base_url = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.getenv("LLM_MODEL", "")

    if not api_key or not model:
        raise RuntimeError("Set LLM_API_KEY and LLM_MODEL in backend/.env.")

    payload = {
        "model": model,
        "messages": [m.model_dump() for m in messages],
        "temperature": 0.7,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=90) as client:
        response = await client.post(
            f"{base_url}/chat/completions",
            json=payload,
            headers=headers,
        )
        response.raise_for_status()
        data = response.json()

    return data["choices"][0]["message"]["content"]


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    user_messages = [m for m in request.messages if m.role == "user"]

    if not user_messages:
        return ChatResponse(
            message=Message(
                role="assistant",
                content="Send a message to start the conversation.",
            )
        )

    last_user_message = user_messages[-1].content
    mode = os.getenv("LLM_MODE", "demo").lower()

    try:
        if mode == "api":
            answer = await api_answer(request.messages)
        else:
            answer = demo_answer(last_user_message)
    except Exception as exc:
        answer = f"AI connection error: {exc}"

    return ChatResponse(
        message=Message(role="assistant", content=answer)
    )
