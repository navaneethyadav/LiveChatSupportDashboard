from sqlalchemy import (
    Column,
    Integer,
    String
)

from app.db.database import Base


class Log(Base):

    __tablename__ = "logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    action = Column(
        String,
        nullable=False
    )