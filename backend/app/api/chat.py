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

import pytz
import json


router = APIRouter()


# =========================================
# INDIA TIMEZONE
# =========================================

india_timezone = pytz.timezone(
    "Asia/Kolkata"
)


# =========================================
# CONNECTION MANAGER
# =========================================

class ConnectionManager:

    def __init__(self):

        self.active_connections = set()

    # =====================================
    # CONNECT
    # =====================================

    async def connect(
        self,
        websocket: WebSocket
    ):

        await websocket.accept()

        self.active_connections.add(
            websocket
        )

    # =====================================
    # DISCONNECT
    # =====================================

    def disconnect(
        self,
        websocket: WebSocket
    ):

        self.active_connections.discard(
            websocket
        )

    # =====================================
    # SEND EVENT
    # =====================================

    async def send_event(
        self,
        event_type: str,
        data: dict
    ):

        disconnected_connections = set()

        event_payload = {

            "type": event_type,

            "data": data

        }

        for connection in self.active_connections.copy():

            try:

                await connection.send_text(
                    json.dumps(event_payload)
                )

            except Exception:

                disconnected_connections.add(
                    connection
                )

        for dead_connection in disconnected_connections:

            self.disconnect(
                dead_connection
            )

    # =====================================
    # CHAT MESSAGE EVENT
    # =====================================

    async def broadcast_chat_message(
        self,
        message_data: dict
    ):

        await self.send_event(
            "chat_message",
            message_data
        )

    # =====================================
    # TYPING EVENT
    # =====================================

    async def broadcast_typing(
        self,
        typing_data: dict
    ):

        await self.send_event(
            "typing",
            typing_data
        )

    # =====================================
    # STATUS UPDATE EVENT
    # =====================================

    async def broadcast_status_update(
        self,
        status_data: dict
    ):

        await self.send_event(
            "chat_status_updated",
            status_data
        )

    # =====================================
    # NOTIFICATION EVENT
    # =====================================

    async def broadcast_notification(
        self,
        notification_data: dict
    ):

        await self.send_event(
            "notification",
            notification_data
        )

    # =====================================
    # DASHBOARD EVENT
    # =====================================

    async def broadcast_dashboard_update(
        self,
        dashboard_data: dict
    ):

        await self.send_event(
            "dashboard_update",
            dashboard_data
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
async def update_chat_status(

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

    await manager.broadcast_status_update({

        "id":
        message.id,

        "status":
        message.status

    })

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

    raw_token = websocket.query_params.get(
        "token"
    )

    token = (
        unquote(raw_token)
        if raw_token
        else None
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

        if not payload:

            await websocket.close(
                code=1008
            )

            return

        email = payload.get(
            "sub"
        )

        if not email:

            await websocket.close(
                code=1008
            )

            return

    except Exception:

        await websocket.close(
            code=1008
        )

        return

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

            manager.disconnect(
                websocket
            )

            await websocket.close()

            return

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

            # =====================================
            # INDIA TIME
            # =====================================

            timestamp = datetime.now(
                india_timezone
            ).isoformat()

            # =====================================
            # TYPING EVENT
            # =====================================

            if is_typing:

                await manager.broadcast_typing({

                    "sender":
                    user.full_name,

                    "email":
                    user.email,

                    "role":
                    user.role,

                    "timestamp":
                    timestamp

                })

                continue

            clean_message = message.strip()

            if not clean_message:

                continue

            # =====================================
            # SAVE MESSAGE
            # =====================================

            new_message = ChatMessage(

                sender=user.full_name,

                email=user.email,

                role=user.role,

                status=status,

                receiver="Support",

                message=clean_message

            )

            db.add(new_message)

            db.commit()

            db.refresh(new_message)

            print(
                f"{user.full_name}: {clean_message}"
            )

            # =====================================
            # RESPONSE DATA
            # =====================================

            response_data = {

                "id":
                new_message.id,

                "sender":
                new_message.sender,

                "email":
                new_message.email,

                "role":
                new_message.role,

                "status":
                new_message.status,

                "message":
                new_message.message,

                "created_at":
                timestamp

            }

            # =====================================
            # REALTIME BROADCAST
            # =====================================

            await manager.broadcast_chat_message(
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
        