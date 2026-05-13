from pydantic import BaseModel


class TicketCreate(BaseModel):

    title: str

    description: str

    priority: str

    category_id: int

    created_by: int


class TicketAssign(BaseModel):

    assigned_to: str
    