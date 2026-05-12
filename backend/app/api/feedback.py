from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.db.deps import get_db

from app.models.feedback import Feedback

from app.schemas.feedback_schema import (
    FeedbackCreate
)


router = APIRouter()


@router.post("/feedback")
def create_feedback(

    feedback: FeedbackCreate,

    db: Session = Depends(get_db)

):

    new_feedback = Feedback(

        ticket_id=feedback.ticket_id,

        rating=feedback.rating,

        comment=feedback.comment
    )

    db.add(new_feedback)

    db.commit()

    db.refresh(new_feedback)

    return {
        "message": "Feedback submitted successfully"
    }


@router.get("/feedback")
def get_feedbacks(

    db: Session = Depends(get_db)

):

    feedbacks = db.query(
        Feedback
    ).all()

    return feedbacks