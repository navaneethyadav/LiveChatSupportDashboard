from sqlalchemy import Column, Integer, String, ForeignKey

from app.db.database import Base


class Feedback(Base):

    __tablename__ = "feedbacks"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    ticket_id = Column(
        Integer,
        ForeignKey("tickets.id")
    )

    rating = Column(
        Integer,
        nullable=False
    )

    comment = Column(
        String,
        nullable=True
    )