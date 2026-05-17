from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from sqlalchemy.orm import relationship

from datetime import datetime
from datetime import timezone

from app.db.database import Base


class TicketReply(Base):

    __tablename__ = "ticket_replies"

    # =====================================
    # ID
    # =====================================

    id = Column(

        Integer,

        primary_key=True,

        index=True

    )

    # =====================================
    # TICKET ID
    # =====================================

    ticket_id = Column(

        Integer,

        ForeignKey(
            "tickets.id",
            ondelete="CASCADE"
        ),

        nullable=False

    )

    # =====================================
    # SENDER NAME
    # =====================================

    sender_name = Column(

        String,

        nullable=False

    )

    # =====================================
    # SENDER ROLE
    # =====================================

    sender_role = Column(

        String,

        nullable=False

    )

    # =====================================
    # MESSAGE
    # =====================================

    message = Column(

        String,

        nullable=False

    )

    # =====================================
    # CREATED TIME
    # =====================================

    created_at = Column(

        DateTime(timezone=True),

        default=lambda: datetime.now(timezone.utc)

    )

    # =====================================
    # RELATIONSHIP
    # =====================================

    ticket = relationship(
        "Ticket",
        back_populates="replies"
    )