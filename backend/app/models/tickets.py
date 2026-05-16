from fastapi import FastAPI
from fastapi import Depends

from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles

from sqlalchemy import text

import os

from app.db.database import engine, Base

from app.models.users import User
from app.models.tickets import Ticket
from app.models.categories import Category
from app.models.feedback import Feedback
from app.models.logs import Log
from app.models.chat_message import ChatMessage
from app.models.password_reset_token import PasswordResetToken

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


app = FastAPI(
    title="SupportHub API",
    version="1.0.0"
)


# =========================================
# CORS
# =========================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "http://localhost:5173",

        "https://live-chat-support-dashboard.vercel.app"

    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)


# =========================================
# CREATE DATABASE TABLES
# =========================================

Base.metadata.create_all(
    bind=engine
)


# =========================================
# AUTO DATABASE MIGRATION
# =========================================

with engine.connect() as conn:

    # =========================================
    # CHAT_MESSAGES TABLE
    # =========================================

    conn.execute(text("""
        ALTER TABLE chat_messages
        ADD COLUMN IF NOT EXISTS email VARCHAR
    """))

    conn.execute(text("""
        ALTER TABLE chat_messages
        ADD COLUMN IF NOT EXISTS role VARCHAR
    """))

    conn.execute(text("""
        ALTER TABLE chat_messages
        ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'Open'
    """))

    # =========================================
    # USERS TABLE
    # =========================================

    conn.execute(text("""
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE
    """))

    # =========================================
    # TICKETS TABLE
    # =========================================

    conn.execute(text("""
        ALTER TABLE tickets
        ADD COLUMN IF NOT EXISTS attachment VARCHAR
    """))

    conn.commit()


# =========================================
# CREATE uploads FOLDER
# =========================================

if not os.path.exists("uploads"):

    os.makedirs("uploads")


# =========================================
# STATIC FILES
# =========================================

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# =========================================
# PUBLIC ROUTES
# =========================================

app.include_router(auth_router)

app.include_router(chatbot_router)


# =========================================
# PROTECTED ROUTES
# =========================================

app.include_router(
    ticket_router,
    dependencies=[Depends(get_current_user)]
)

app.include_router(
    dashboard_router,
    dependencies=[Depends(get_current_user)]
)

app.include_router(
    category_router,
    dependencies=[Depends(get_current_user)]
)

app.include_router(
    logs_router,
    dependencies=[Depends(get_current_user)]
)

app.include_router(
    users_router,
    dependencies=[Depends(get_current_user)]
)

app.include_router(
    export_router,
    dependencies=[Depends(get_current_user)]
)

app.include_router(
    test_email_router,
    dependencies=[Depends(get_current_user)]
)

app.include_router(
    feedback_router,
    dependencies=[Depends(get_current_user)]
)


# =========================================
# WEBSOCKET ROUTES
# =========================================

app.include_router(chat_router)


# =========================================
# ROOT
# =========================================

@app.get("/")
def root():

    return {

        "message":
        "Live Chat Support Dashboard Backend Running Successfully"

    }


# =========================================
# PROFILE
# =========================================

@app.get("/profile")
def profile(

    current_user: dict = Depends(
        get_current_user
    )

):

    return {

        "message": "Protected profile route",

        "logged_in_user": current_user

    }
