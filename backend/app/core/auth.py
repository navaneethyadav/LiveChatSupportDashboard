from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.core.security import (
    verify_access_token
)

from app.db.deps import (
    get_db,
    get_token_header
)

from app.models.users import User


def get_current_user(

    token: str = Depends(
        get_token_header
    ),

    db: Session = Depends(get_db)

):

    credentials_exception = HTTPException(

        status_code=401,

        detail="Could not validate credentials"

    )

    try:

        payload = verify_access_token(
            token
        )

        email = payload.get(
            "sub"
        )

        if email is None:

            raise credentials_exception

    except Exception:

        raise credentials_exception

    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None:

        raise credentials_exception

    return user


def admin_required(

    current_user: User = Depends(
        get_current_user
    )

):

    if current_user.role != "admin":

        raise HTTPException(

            status_code=403,

            detail="Admin access required"

        )

    return current_user
    