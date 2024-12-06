from fastapi import FastAPI
from app.routers import chat_router, detect_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific domains in production
    allow_credentials=True,
    allow_methods=["*"],  # e.g., ["GET", "POST", "OPTIONS"]
    allow_headers=["*"],  # e.g., ["Authorization", "Content-Type"]
)

app.include_router(chat_router.router)
app.include_router(detect_router.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the app"}

from fastapi import APIRouter, WebSocket
from fastapi.websockets import WebSocketDisconnect
from app.utils.query_processor import generate_response
from app.utils.index import Query
import json

@app.websocket("/chatbot")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    conversation_history = []

    try:
        while True:
            # Receive message from the client
            data = await websocket.receive_text()
            
            # Process the message
            user_message = {"role": "user", "content": data}
            conversation_history.append(user_message)
            
            # Generate response
            response = generate_response(user_message["content"], conversation_history)
            assistant_message = {"role": "assistant", "content": response}
            conversation_history.append(assistant_message)
            
            # Send the response back to the client
            await websocket.send_text(json.dumps(assistant_message))
    
    except WebSocketDisconnect:
        print("WebSocket disconnected")