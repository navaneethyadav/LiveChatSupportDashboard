from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.models.tickets import Ticket

router = APIRouter()


@router.get("/dashboard/stats")
def dashboard_stats(
    db: Session = Depends(get_db)
):

    total_tickets = db.query(Ticket).count()

    open_tickets = db.query(Ticket).filter(
        Ticket.status == "Open"
    ).count()

    resolved_tickets = db.query(Ticket).filter(
        Ticket.status == "Resolved"
    ).count()

    high_priority = db.query(Ticket).filter(
        Ticket.priority == "High"
    ).count()

    return {
        "total_tickets": total_tickets,
        "open_tickets": open_tickets,
        "resolved_tickets": resolved_tickets,
        "high_priority": high_priority
    }