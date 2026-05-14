from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import UploadFile
from fastapi import File
from fastapi import Form

from sqlalchemy.orm import Session

from app.models.logs import Log
from app.models.feedback import Feedback

from app.db.deps import (
    get_db,
    get_current_logged_in_user
)

from app.models.tickets import Ticket
from app.models.users import User

from app.schemas.ticket_schema import (
    TicketAssign
)

from app.core.security import require_admin

import os
import shutil
import uuid


router = APIRouter()


UPLOAD_DIR = "uploads"


if not os.path.exists(UPLOAD_DIR):

    os.makedirs(UPLOAD_DIR)


@router.post("/tickets")
async def create_ticket(

    title: str = Form(...),

    description: str = Form(...),

    priority: str = Form(...),

    category_id: int = Form(...),

    attachment: UploadFile = File(None),

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_logged_in_user
    )

):

    file_path = None

    if attachment:

        unique_filename = (
            f"{uuid.uuid4()}_{attachment.filename}"
        )

        file_location = os.path.join(
            UPLOAD_DIR,
            unique_filename
        )

        with open(file_location, "wb") as buffer:

            shutil.copyfileobj(
                attachment.file,
                buffer
            )

        file_path = file_location

    new_ticket = Ticket(

        title=title,

        description=description,

        priority=priority,

        category_id=category_id,

        created_by=current_user.id,

        attachment=file_path

    )

    db.add(new_ticket)

    db.commit()

    db.refresh(new_ticket)

    log = Log(
        action=f"Ticket #{new_ticket.id} created by {current_user.full_name}"
    )

    db.add(log)

    db.commit()

    return {

        "message": "Ticket created successfully",

        "ticket_id": new_ticket.id,

        "attachment": file_path

    }


@router.get("/tickets")
def get_tickets(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_logged_in_user
    )

):

    if current_user.role == "admin":

        tickets = db.query(
            Ticket
        ).order_by(
            Ticket.id.desc()
        ).all()

    else:

        tickets = db.query(
            Ticket
        ).filter(
            Ticket.created_by == current_user.id
        ).order_by(
            Ticket.id.desc()
        ).all()

    return tickets


@router.put("/tickets/{ticket_id}")
async def update_ticket_status(

    ticket_id: int,

    status: str,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_logged_in_user
    )

):

    require_admin(
        current_user
    )

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:

        raise HTTPException(

            status_code=404,

            detail="Ticket not found"

        )

    ticket.status = status

    db.commit()

    db.refresh(ticket)

    log = Log(
        action=f"Ticket #{ticket.id} marked as {status} by {current_user.full_name}"
    )

    db.add(log)

    db.commit()

    return {

        "message": "Ticket updated successfully",

        "ticket": ticket

    }


@router.put("/tickets/{ticket_id}/assign")
async def assign_ticket(

    ticket_id: int,

    payload: TicketAssign,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_logged_in_user
    )

):

    require_admin(
        current_user
    )

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:

        raise HTTPException(

            status_code=404,

            detail="Ticket not found"

        )

    ticket.assigned_to = payload.assigned_to

    db.commit()

    db.refresh(ticket)

    log = Log(
        action=f"Ticket #{ticket.id} assigned to {payload.assigned_to} by {current_user.full_name}"
    )

    db.add(log)

    db.commit()

    return {

        "message": "Ticket assigned successfully",

        "ticket": ticket

    }


@router.delete("/tickets/{ticket_id}")
def delete_ticket(

    ticket_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_logged_in_user
    )

):

    require_admin(
        current_user
    )

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:

        raise HTTPException(

            status_code=404,

            detail="Ticket not found"

        )

    try:

        feedbacks = db.query(
            Feedback
        ).filter(
            Feedback.ticket_id == ticket_id
        ).all()

        for feedback in feedbacks:

            db.delete(feedback)

        if ticket.attachment:

            if os.path.exists(ticket.attachment):

                os.remove(ticket.attachment)

        db.delete(ticket)

        db.commit()

        log = Log(
            action=f"Ticket #{ticket.id} deleted by {current_user.full_name}"
        )

        db.add(log)

        db.commit()

        return {

            "message": "Ticket deleted successfully"

        }

    except Exception as e:

        db.rollback()

        print(
            "Delete Ticket Error:",
            e
        )

        raise HTTPException(

            status_code=500,

            detail="Failed to delete ticket"

        )
        