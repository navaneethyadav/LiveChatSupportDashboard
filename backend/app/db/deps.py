from fastapi import Depends
from fastapi import Header
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db.database import SessionLocal

from app.core.security import get_current_user


def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


def get_token_header(

    authorization: str = Header(None)

):

    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )

    try:

        scheme, token = authorization.split()

    except ValueError:

        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format"
        )

    if scheme.lower() != "bearer":

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication scheme"
        )

    return token


def get_current_logged_in_user(

    token: str = Depends(get_token_header),

    db: Session = Depends(get_db)

):

    return get_current_user(
        token,
        db
    )
    