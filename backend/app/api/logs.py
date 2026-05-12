from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.db.deps import get_db

from app.models.logs import Log


router = APIRouter()


@router.get("/logs")
def get_logs(
    db: Session = Depends(get_db)
):

    logs = db.query(Log).order_by(
        Log.id.desc()
    ).all()

    return logs