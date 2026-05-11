from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.models.tickets import Ticket
from app.schemas.ticket_schema import TicketCreate

router = APIRouter()


@router.post("/tickets")
def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db)
):

    new_ticket = Ticket(
        title=ticket.title,
        description=ticket.description,
        priority=ticket.priority
    )

    db.add(new_ticket)

    db.commit()

    db.refresh(new_ticket)

    return {
        "message": "Ticket created successfully",
        "ticket_id": new_ticket.id
    }


@router.get("/tickets")
def get_tickets(
    db: Session = Depends(get_db)
):

    tickets = db.query(Ticket).all()

    return tickets


@router.put("/tickets/{ticket_id}")
def update_ticket_status(
    ticket_id: int,
    status: str,
    db: Session = Depends(get_db)
):

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        return {
            "message": "Ticket not found"
        }

    ticket.status = status

    db.commit()

    db.refresh(ticket)

    return {
        "message": "Ticket updated successfully",
        "ticket": ticket
    }


@router.delete("/tickets/{ticket_id}")
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:
        return {
            "message": "Ticket not found"
        }

    db.delete(ticket)

    db.commit()

    return {
        "message": "Ticket deleted successfully"
    }