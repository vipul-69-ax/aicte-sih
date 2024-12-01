from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel
import asyncio
from typing import List, Dict
import json
from chat.query_processor import generate_response

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Allow all hosts
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])


class Query(BaseModel):
    text: str

class Message(BaseModel):
    role: str
    content: str


@app.get("/")
def index():
    return "Hello, World"

@app.post("/chat")
async def chat_endpoint(query: Query):
    """
    Handle regular RESTful POST requests for single-response communication.
    """
    conversation_history: List[Dict[str, str]] = []
    user_message = {"role": "user", "content": query.text}
    conversation_history.append(user_message)

    response = generate_response(query.text, conversation_history)
    assistant_message = {"role": "assistant", "content": response}
    conversation_history.append(assistant_message)

    return assistant_message


@app.get("/chat/stream")
async def stream_chat(request: Request):
    """
    SSE endpoint for streaming chat responses.
    """

    async def event_generator():
        conversation_history: List[Dict[str, str]] = []

        while True:
            # Wait for new input
            if await request.is_disconnected():
                break

            # Simulate incoming user message
            user_message = {"role": "user", "content": "Your message here"}
            conversation_history.append(user_message)

            # Generate assistant's response
            response = generate_response(user_message["content"], conversation_history)
            assistant_message = {"role": "assistant", "content": response}
            conversation_history.append(assistant_message)

            # Stream the assistant's response
            yield f"data: {json.dumps(assistant_message)}\n\n"
            await asyncio.sleep(1)  # Simulate response delay if needed

    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
