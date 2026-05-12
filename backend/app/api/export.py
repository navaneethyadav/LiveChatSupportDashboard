from fastapi import APIRouter, Depends

from fastapi.responses import StreamingResponse

from sqlalchemy.orm import Session

from app.db.deps import get_db

from app.models.users import User

import csv

import io


router = APIRouter()


@router.get("/export/users")
def export_users_csv(
    db: Session = Depends(get_db)
):

    users = db.query(User).all()

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "ID",
        "Full Name",
        "Email",
        "Role"
    ])

    for user in users:

        writer.writerow([
            user.id,
            user.full_name,
            user.email,
            user.role
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
            "attachment; filename=users_report.csv"
        }
    )