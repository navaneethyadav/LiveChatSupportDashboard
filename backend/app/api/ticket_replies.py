from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from pydantic import BaseModel

from sqlalchemy.orm import Session

from app.db.deps import (
    get_db,
    get_current_logged_in_user
)

from app.models.ticket_reply import TicketReply
from app.models.tickets import Ticket
from app.models.users import User


router = APIRouter(
    tags=["Ticket Replies"]
)


# =========================================
# REQUEST SCHEMA
# =========================================

class ReplyCreate(BaseModel):

    message: str


# =========================================
# GET REPLIES
# =========================================

@router.get("/tickets/{ticket_id}/replies")
def get_ticket_replies(

    ticket_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_logged_in_user
    )

):

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    replies = db.query(
        TicketReply
    ).filter(
        TicketReply.ticket_id == ticket_id
    ).order_by(
        TicketReply.id.asc()
    ).all()

    return replies


# =========================================
# CREATE REPLY
# =========================================

@router.post("/tickets/{ticket_id}/replies")
def create_reply(

    ticket_id: int,

    payload: ReplyCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_logged_in_user
    )

):

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    new_reply = TicketReply(

        ticket_id=ticket_id,

        sender_name=current_user.full_name,

        sender_role=current_user.role,

        message=payload.message

    )

    db.add(new_reply)

    db.commit()

    db.refresh(new_reply)

    return {
        "message": "Reply added successfully",
        "reply": new_reply
    }
