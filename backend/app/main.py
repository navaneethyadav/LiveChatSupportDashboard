from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine, Base

from app.models.tickets import Ticket
from app.models.users import User

from app.api.auth import router as auth_router
from app.api.tickets import router as ticket_router
from app.api.dashboard import router as dashboard_router

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