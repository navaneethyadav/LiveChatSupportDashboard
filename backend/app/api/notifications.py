from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db.deps import (
    get_db,
    get_current_logged_in_user
)

from app.models.notifications import Notification
from app.models.users import User


router = APIRouter(
    tags=["Notifications"]
)


# =========================================
# GET USER NOTIFICATIONS
# =========================================

@router.get("/notifications")
def get_notifications(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_logged_in_user
    )

):

    notifications = db.query(
        Notification
    ).filter(
        Notification.user_id == current_user.id
    ).order_by(
        Notification.id.desc()
    ).all()

    return notifications


# =========================================
# MARK NOTIFICATION AS READ
# =========================================

@router.put("/notifications/{notification_id}/read")
def mark_notification_read(

    notification_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_logged_in_user
    )

):

    notification = db.query(
        Notification
    ).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()

    if not notification:

        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    notification.is_read = True

    db.commit()

    return {
        "message": "Notification marked as read"
    }


# =========================================
# DELETE NOTIFICATION
# =========================================

@router.delete("/notifications/{notification_id}")
def delete_notification(

    notification_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_logged_in_user
    )

):

    notification = db.query(
        Notification
    ).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()

    if not notification:

        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    db.delete(notification)

    db.commit()

    return {
        "message": "Notification deleted successfully"
    }