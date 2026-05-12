from fastapi import APIRouter

from app.services.email_service import send_email


router = APIRouter()


@router.get("/test-email")
async def test_email():

    await send_email(

        subject="Support Dashboard Test",

        email="navaneethkaku@gmail.com",

        body="Enterprise email system working successfully."
    )

    return {
        "message": "Test email sent successfully"
    }