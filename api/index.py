from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel
from controllers.chat.query_processor import generate_response
from typing import List, Dict
import json

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for WebSocket
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

@app.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    conversation_history: List[Dict[str, str]] = []
    try:
        while True:
            data = await websocket.receive_text()
            user_message = {"role": "user", "content": data}
            conversation_history.append(user_message)
            
            response = generate_response(data, conversation_history)
            assistant_message = {"role": "assistant", "content": response}
            conversation_history.append(assistant_message)
            
            await websocket.send_text(json.dumps(assistant_message))
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        await websocket.close(code=1011, reason=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)