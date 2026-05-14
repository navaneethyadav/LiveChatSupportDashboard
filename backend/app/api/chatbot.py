from fastapi import APIRouter

from difflib import get_close_matches


router = APIRouter()


FAQ_RESPONSES = {

    "password": (
        "To reset your password, go to "
        "'Forgot Password' on the login page."
    ),

    "reset password": (
        "Click on 'Forgot Password' "
        "to receive a password reset link."
    ),

    "ticket": (
        "You can create support tickets "
        "from the Tickets page."
    ),

    "create ticket": (
        "Open the Tickets page and click "
        "'Create Ticket'."
    ),

    "support": (
        "Our support team is available 24/7."
    ),

    "hello": (
        "Hello! How can I help you today?"
    ),

    "hi": (
        "Hi! Welcome to SupportHub."
    ),

    "email verification": (
        "Please check your inbox and "
        "click the verification link."
    ),

    "verify email": (
        "Open your email inbox and "
        "click on the verification link."
    ),

    "dashboard": (
        "Dashboard provides ticket stats, "
        "logs, and activity overview."
    ),

    "admin": (
        "Admins can manage users, "
        "tickets, categories, and logs."
    ),

    "chat": (
        "Live chat is available for "
        "real-time customer support."
    ),

    "feedback": (
        "Users can submit feedback "
        "after ticket resolution."
    ),

    "logout": (
        "Use the logout button from "
        "the top navigation menu."
    )
}


@router.get("/chatbot")
def chatbot(
    message: str
):

    user_message = message.lower().strip()


    for keyword, response in FAQ_RESPONSES.items():

        if keyword in user_message:

            return {
                "reply": response
            }


    possible_matches = get_close_matches(

        user_message,

        FAQ_RESPONSES.keys(),

        n=1,

        cutoff=0.6

    )


    if possible_matches:

        matched_keyword = possible_matches[0]

        return {
            "reply":
            FAQ_RESPONSES[matched_keyword]
        }


    return {

        "reply": (
            "Sorry, I could not understand "
            "your request. Please contact support."
        )

    }
    