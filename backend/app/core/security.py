import os

from passlib.context import CryptContext

from jose import jwt
from jose import JWTError

from datetime import datetime
from datetime import timedelta

from fastapi import HTTPException

from sqlalchemy.orm import Session

from dotenv import load_dotenv

from app.models.users import User


load_dotenv()


SECRET_KEY = os.getenv(
    "SECRET_KEY"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


pwd_context = CryptContext(

    schemes=["pbkdf2_sha256"],

    deprecated="auto"

)


def hash_password(
    password: str
):

    return pwd_context.hash(
        password
    )


def verify_password(

    plain_password,

    hashed_password

):

    return pwd_context.verify(

        plain_password,

        hashed_password

    )


def create_access_token(
    data: dict
):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(

        minutes=ACCESS_TOKEN_EXPIRE_MINUTES

    )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(

        to_encode,

        SECRET_KEY,

        algorithm=ALGORITHM

    )

    return encoded_jwt


def verify_access_token(
    token: str
):

    try:

        payload = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=[ALGORITHM]

        )

        return payload

    except JWTError:

        raise HTTPException(

            status_code=401,

            detail="Invalid or expired token"

        )


def get_current_user(

    token: str,

    db: Session

):

    payload = verify_access_token(
        token
    )

    email = payload.get("sub")

    if not email:

        raise HTTPException(

            status_code=401,

            detail="Invalid token payload"

        )

    user = db.query(User).filter(

        User.email == email

    ).first()

    if not user:

        raise HTTPException(

            status_code=404,

            detail="User not found"

        )

    return user


def require_admin(
    current_user
):

    if current_user.role != "admin":

        raise HTTPException(

            status_code=403,

            detail="Admin access required"

        )

    return current_user
    