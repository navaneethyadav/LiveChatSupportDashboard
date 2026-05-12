from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.db.deps import get_db

from app.models.users import User


router = APIRouter()


@router.get("/users")
def get_users(
    db: Session = Depends(get_db)
):

    users = db.query(User).all()

    return users


@router.put("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        return {
            "message": "User not found"
        }

    user.role = role

    db.commit()

    db.refresh(user)

    return {
        "message": "Role updated successfully",
        "user": user
    }