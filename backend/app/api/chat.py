from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query

from sqlalchemy.orm import Session

from app.db.database import SessionLocal

from app.db.deps import get_db

from app.models.chat_message import ChatMessage

from app.models.users import User

from app.core.security import (
    verify_access_token
)

from datetime import datetime

import json


router = APIRouter()

active_connections = []


@router.get("/chat/messages")
def get_chat_messages(

    email: str = Query(None),

    role: str = Query(None),

    db: Session = Depends(get_db)

):

    if role == "admin":

        messages = db.query(
            ChatMessage
        ).order_by(
            ChatMessage.id.asc()
        ).all()

    else:

        messages = db.query(
            ChatMessage
        ).filter(
            ChatMessage.email == email
        ).order_by(
            ChatMessage.id.asc()
        ).all()

    return messages


@router.put("/chat/status/{message_id}")
def update_chat_status(

    message_id: int,

    status: str,

    db: Session = Depends(get_db)

):

    message = db.query(
        ChatMessage
    ).filter(
        ChatMessage.id == message_id
    ).first()

    if not message:

        raise HTTPException(

            status_code=404,

            detail="Message not found"

        )

    message.status = status

    db.commit()

    db.refresh(message)

    return {

        "message":
        "Status updated successfully"

    }


@router.websocket("/ws/chat")
async def websocket_chat(
    websocket: WebSocket
):

    token = websocket.query_params.get(
        "token"
    )

    if not token:

        await websocket.close(
            code=1008
        )

        return


    try:

        payload = verify_access_token(
            token
        )

        email = payload.get("sub")

        if not email:

            await websocket.close(
                code=1008
            )

            return

    except:

        await websocket.close(
            code=1008
        )

        return


    await websocket.accept()

    active_connections.append(
        websocket
    )

    print(
        f"Client connected: {email}"
    )

    db: Session = SessionLocal()

    try:

        user = db.query(User).filter(
            User.email == email
        ).first()

        while True:

            data = await websocket.receive_text()

            parsed_data = json.loads(
                data
            )

            status = parsed_data.get(
                "status",
                "Open"
            )

            message = parsed_data.get(
                "message"
            )

            is_typing = parsed_data.get(
                "is_typing",
                False
            )

            timestamp = datetime.now().strftime(
                "%I:%M %p"
            )

            saved_message = None

            if not is_typing and message:

                new_message = ChatMessage(

                    sender=user.full_name,

                    email=user.email,

                    role=user.role,

                    status=status,

                    receiver="Support",

                    message=message

                )

                db.add(new_message)

                db.commit()

                db.refresh(new_message)

                saved_message = new_message

                print(
                    user.full_name,
                    ":",
                    message
                )


            response_data = json.dumps({

                "id":
                saved_message.id if saved_message else None,

                "sender":
                user.full_name,

                "email":
                user.email,

                "role":
                user.role,

                "status":
                status,

                "message":
                message,

                "timestamp":
                timestamp,

                "is_typing":
                is_typing

            })


            disconnected_connections = []

            for connection in active_connections:

                try:

                    await connection.send_text(
                        response_data
                    )

                except:

                    disconnected_connections.append(
                        connection
                    )


            for dead_connection in disconnected_connections:

                if dead_connection in active_connections:

                    active_connections.remove(
                        dead_connection
                    )


    except WebSocketDisconnect:

        if websocket in active_connections:

            active_connections.remove(
                websocket
            )

        print(
            f"Client disconnected: {email}"
        )

    finally:

        db.close()
        