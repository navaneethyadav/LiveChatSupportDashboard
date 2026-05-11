from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    description = Column(String, nullable=False)

    status = Column(String, default="Open")

    priority = Column(String, default="Medium")

    created_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    user = relationship("User")