from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from app.db.database import Base


class Ticket(Base):

    __tablename__ = "tickets"

    # =====================================
    # ID
    # =====================================

    id = Column(

        Integer,

        primary_key=True,

        index=True

    )

    # =====================================
    # TITLE
    # =====================================

    title = Column(

        String,

        nullable=False

    )

    # =====================================
    # DESCRIPTION
    # =====================================

    description = Column(

        String,

        nullable=False

    )

    # =====================================
    # STATUS
    # =====================================

    status = Column(

        String,

        default="Open"

    )

    # =====================================
    # PRIORITY
    # =====================================

    priority = Column(

        String,

        default="Medium"

    )

    # =====================================
    # ATTACHMENT
    # =====================================

    attachment = Column(

        String,

        nullable=True

    )

    # =====================================
    # CATEGORY ID
    # =====================================

    category_id = Column(

        Integer,

        ForeignKey("categories.id")

    )

    # =====================================
    # CREATED BY
    # =====================================

    created_by = Column(

        Integer,

        ForeignKey("users.id")

    )

    # =====================================
    # ASSIGNED TO
    # =====================================

    assigned_to = Column(

        String,

        nullable=True

    )

    # =====================================
    # USER RELATIONSHIP
    # =====================================

    user = relationship(

        "User"

    )

    # =====================================
    # TICKET REPLIES RELATIONSHIP
    # =====================================

    replies = relationship(

        "TicketReply",

        back_populates="ticket",

        cascade="all, delete-orphan"

    )