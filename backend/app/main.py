from fastapi import FastAPI, Depends

from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine, Base

from app.models.users import User
from app.models.tickets import Ticket
from app.models.categories import Category
from app.models.feedback import Feedback
from app.models.logs import Log
from app.models.chat_message import ChatMessage

from app.api.auth import router as auth_router
from app.api.tickets import router as ticket_router
from app.api.dashboard import router as dashboard_router
from app.api.categories import router as category_router
from app.api.feedback import router as feedback_router
from app.api.logs import router as logs_router
from app.api.chat import router as chat_router
from app.api.users import router as users_router
from app.api.export import router as export_router
from app.api.test_email import router as test_email_router
from app.api.chatbot import router as chatbot_router

from app.core.auth import get_current_user


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


app.include_router(auth_router)

app.include_router(ticket_router)

app.include_router(dashboard_router)

app.include_router(category_router)

app.include_router(logs_router)

app.include_router(users_router)

app.include_router(export_router)

app.include_router(test_email_router)

app.include_router(chatbot_router)

app.include_router(chat_router)

app.include_router(feedback_router)


@app.get("/")
def root():

    return {
        "message": "Live Chat Support Dashboard Backend Running Successfully"
    }


@app.get("/profile")
def profile(
    current_user: str = Depends(get_current_user)
):

    return {
        "message": "Protected profile route",
        "logged_in_user": current_user
    }