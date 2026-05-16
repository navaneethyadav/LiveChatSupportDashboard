from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from app.db.database import Base


class Ticket(Base):

    __tablename__ = "tickets"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    description = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="Open"
    )

    priority = Column(
        String,
        default="Medium"
    )

    attachment = Column(
        String,
        nullable=True
    )

    category_id = Column(
        Integer,
        ForeignKey("categories.id")
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    assigned_to = Column(
        String,
        nullable=True
    )

    user = relationship("User")
    