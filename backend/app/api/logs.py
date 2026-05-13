from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.deps import get_db

from app.models.logs import Log

from app.models.users import User

from app.core.auth import (
    admin_required
)


router = APIRouter()


@router.get("/logs")
def get_logs(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        admin_required
    )

):

    logs = db.query(Log).order_by(
        Log.id.desc()
    ).all()

    return logs
    