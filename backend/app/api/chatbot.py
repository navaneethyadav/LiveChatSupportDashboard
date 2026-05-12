from fastapi import APIRouter


router = APIRouter()


@router.get("/chatbot")
def chatbot(
    message: str
):

    msg = message.lower()


    if "password" in msg:

        return {
            "reply":
            "To reset password, go to settings and click reset password."
        }


    elif "ticket" in msg:

        return {
            "reply":
            "You can create tickets from the Tickets page."
        }


    elif "support" in msg:

        return {
            "reply":
            "Support team is available 24/7."
        }


    elif "hello" in msg:

        return {
            "reply":
            "Hello! How can I help you today?"
        }


    else:

        return {
            "reply":
            "Sorry, I do not understand. Please contact support."
        }