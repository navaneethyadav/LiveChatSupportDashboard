from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query

from sqlalchemy.orm import Session

from urllib.parse import unquote

from app.db.database import SessionLocal
from app.db.deps import get_db

from app.models.chat_message import ChatMessage
from app.models.users import User

from app.core.security import verify_access_token
from app.core.security import SECRET_KEY

from datetime import datetime

import json


router = APIRouter()


class ConnectionManager:

    def __init__(self):

        self.active_connections = set()

    async def connect(
        self,
        websocket: WebSocket
    ):

        await websocket.accept()

        self.active_connections.add(
            websocket
        )

    def disconnect(
        self,
        websocket: WebSocket
    ):

        self.active_connections.discard(
            websocket
        )

    async def broadcast(
        self,
        message_data: dict
    ):

        disconnected_connections = set()

        for connection in self.active_connections.copy():

            try:

                await connection.send_text(
                    json.dumps(message_data)
                )

            except Exception:

                disconnected_connections.add(
                    connection
                )

        for dead_connection in disconnected_connections:

            self.disconnect(
                dead_connection
            )


manager = ConnectionManager()


# =========================================
# GET CHAT MESSAGES
# =========================================

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


# =========================================
# UPDATE MESSAGE STATUS
# =========================================

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


# =========================================
# WEBSOCKET CHAT
# =========================================

@router.websocket("/ws/chat")
async def websocket_chat(
    websocket: WebSocket
):

    # =========================================
    # GET TOKEN
    # =========================================

    raw_token = websocket.query_params.get(
        "token"
    )

    token = (
        unquote(raw_token)
        if raw_token
        else None
    )

    if not token:

        print(
            "WebSocket Error: No token provided"
        )

        await websocket.close(
            code=1008
        )

        return

    # =========================================
    # VERIFY TOKEN
    # =========================================

    try:

        print(
            "WS SECRET_KEY:",
            SECRET_KEY
        )

        print(
            "WS TOKEN:",
            token
        )

        payload = verify_access_token(
            token
        )

        print(
            "WS PAYLOAD:",
            payload
        )

        if not payload:

            print(
                "WebSocket Error: Invalid payload"
            )

            await websocket.close(
                code=1008
            )

            return

        email = payload.get(
            "sub"
        )

        if not email:

            print(
                "WebSocket Error: No email in token"
            )

            await websocket.close(
                code=1008
            )

            return

    except Exception as e:

        print(
            "WebSocket Auth Error:",
            str(e)
        )

        await websocket.close(
            code=1008
        )

        return

    # =========================================
    # CONNECT
    # =========================================

    await manager.connect(
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

        if not user:

            print(
                "WebSocket Error: User not found"
            )

            manager.disconnect(
                websocket
            )

            await websocket.close()

            return

        # =========================================
        # RECEIVE LOOP
        # =========================================

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
                "message",
                ""
            )

            is_typing = parsed_data.get(
                "is_typing",
                False
            )

            timestamp = datetime.now().strftime(
                "%I:%M %p"
            )

            saved_message = None

            # SAVE ONLY REAL MESSAGES
            if (
                not is_typing and
                message.strip()
            ):

                new_message = ChatMessage(

                    sender=user.full_name,

                    email=user.email,

                    role=user.role,

                    status=status,

                    receiver="Support",

                    message=message.strip()

                )

                db.add(
                    new_message
                )

                db.commit()

                db.refresh(
                    new_message
                )

                saved_message = new_message

                print(
                    f"{user.full_name}: {message}"
                )

            # =========================================
            # RESPONSE
            # =========================================

            response_data = {

                "id":
                saved_message.id
                if saved_message
                else None,

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

            }

            await manager.broadcast(
                response_data
            )

    except WebSocketDisconnect:

        print(
            f"Client disconnected: {email}"
        )

        manager.disconnect(
            websocket
        )

    except Exception as e:

        print(
            "WebSocket Runtime Error:",
            str(e)
        )

        manager.disconnect(
            websocket
        )

    finally:

        manager.disconnect(
            websocket
        )

        db.close()
        