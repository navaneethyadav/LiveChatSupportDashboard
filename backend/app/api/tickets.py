from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.models.logs import Log

from app.db.deps import get_db

from app.models.tickets import Ticket

from app.schemas.ticket_schema import (
    TicketCreate,
    TicketAssign
)

# from app.services.email_service import send_email


router = APIRouter()


@router.post("/tickets")
async def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db)
):

    new_ticket = Ticket(
        title=ticket.title,
        description=ticket.description,
        priority=ticket.priority,
        category_id=ticket.category_id
    )

    db.add(new_ticket)

    db.commit()

    db.refresh(new_ticket)


    log = Log(
        action=f"Ticket #{new_ticket.id} created"
    )

    db.add(log)

    db.commit()


    # EMAIL TEMPORARILY DISABLED
    # await send_email(
    #     subject="Ticket Created Successfully",
    #     email="navaneethkaku@gmail.com",
    #     body=f"Your ticket '{new_ticket.title}' has been created successfully."
    # )


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
async def update_ticket_status(
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


    log = Log(
        action=f"Ticket #{ticket.id} marked as {status}"
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

    db: Session = Depends(get_db)

):

    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:

        return {
            "message": "Ticket not found"
        }

    ticket.assigned_to = payload.assigned_to

    db.commit()

    db.refresh(ticket)


    log = Log(
        action=f"Ticket #{ticket.id} assigned to {payload.assigned_to}"
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


    log = Log(
        action=f"Ticket #{ticket.id} deleted"
    )

    db.add(log)

    db.commit()


    return {
        "message": "Ticket deleted successfully"
    }
    