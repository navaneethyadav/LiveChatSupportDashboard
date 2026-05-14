from sqlalchemy import Column, Integer, String, Boolean

from app.db.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    full_name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    role = Column(
        String,
        default="user"
    )

    password = Column(
        String,
        nullable=False
    )

    is_verified = Column(
        Boolean,
        default=False
    )
    