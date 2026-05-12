from pydantic import BaseModel


class FeedbackCreate(BaseModel):

    ticket_id: int

    rating: int

    comment: str | None = None