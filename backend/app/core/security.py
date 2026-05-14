import os
import re
import hashlib
import secrets

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


SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

RESET_TOKEN_EXPIRE_MINUTES = 30

EMAIL_VERIFICATION_EXPIRE_HOURS = 24


pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


def hash_password(password: str):

    return pwd_context.hash(password)


def verify_password(
    plain_password,
    hashed_password
):

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def create_access_token(data: dict):

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


def verify_access_token(token: str):

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

    payload = verify_access_token(token)

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


def require_admin(current_user):

    if current_user.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user


# =========================
# PASSWORD RESET SECURITY
# =========================

def generate_reset_token():

    return secrets.token_urlsafe(32)


def hash_reset_token(token: str):

    return hashlib.sha256(
        token.encode()
    ).hexdigest()


def get_reset_token_expiry():

    return datetime.utcnow() + timedelta(
        minutes=RESET_TOKEN_EXPIRE_MINUTES
    )


# =========================
# EMAIL VERIFICATION
# =========================

def create_email_verification_token(email: str):

    expire = datetime.utcnow() + timedelta(
        hours=EMAIL_VERIFICATION_EXPIRE_HOURS
    )

    payload = {
        "sub": email,
        "purpose": "email_verification",
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def verify_email_verification_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        if payload.get("purpose") != "email_verification":

            raise HTTPException(
                status_code=400,
                detail="Invalid verification token"
            )

        return payload.get("sub")

    except JWTError:

        raise HTTPException(
            status_code=400,
            detail="Invalid or expired verification token"
        )


# =========================
# PASSWORD VALIDATION
# =========================

def validate_password_strength(password: str):

    if len(password) < 8:

        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long"
        )

    if not re.search(r"[A-Z]", password):

        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one uppercase letter"
        )

    if not re.search(r"[a-z]", password):

        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one lowercase letter"
        )

    if not re.search(r"\d", password):

        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one number"
        )

    if not re.search(r"[@$!%*?&]", password):

        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one special character"
        )
        