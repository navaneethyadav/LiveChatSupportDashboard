from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.database import SessionLocal

from app.db.deps import get_db

from app.models.chat_message import ChatMessage

import json


router = APIRouter()


active_connections = []


@router.get("/chat/messages")
def get_chat_messages(
    db: Session = Depends(get_db)
):

    messages = db.query(
        ChatMessage
    ).order_by(
        ChatMessage.id.asc()
    ).all()

    return messages


@router.websocket("/ws/chat")
async def websocket_chat(
    websocket: WebSocket
):

    await websocket.accept()

    active_connections.append(websocket)

    print("Client connected")

    db: Session = SessionLocal()

    try:

        while True:

            data = await websocket.receive_text()

            parsed_data = json.loads(data)

            sender = parsed_data["sender"]

            message = parsed_data["message"]

            print(sender, ":", message)

            new_message = ChatMessage(
                sender=sender,
                receiver="Support",
                message=message
            )

            db.add(new_message)

            db.commit()

            response_data = json.dumps({
                "sender": sender,
                "message": message
            })

            for connection in active_connections:

                await connection.send_text(
                    response_data
                )

    except WebSocketDisconnect:

        active_connections.remove(websocket)

        print("Client disconnected")

    finally:

        db.close()