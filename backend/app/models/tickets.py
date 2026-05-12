from sqlalchemy import Column, Integer, String, ForeignKey

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