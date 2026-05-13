from sqlalchemy import Column, Integer, String, DateTime

from datetime import datetime

from app.db.database import Base


class ChatMessage(Base):

    __tablename__ = "chat_messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    sender = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        nullable=True
    )

    role = Column(
        String,
        nullable=True
    )

    status = Column(
        String,
        default="Open"
    )

    receiver = Column(
        String,
        nullable=False
    )

    message = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )