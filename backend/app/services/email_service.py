import os

import resend

from dotenv import load_dotenv


# =========================================
# LOAD ENV
# =========================================

load_dotenv()


RESEND_API_KEY = os.getenv(
    "RESEND_API_KEY"
)


# =========================================
# VALIDATE API KEY
# =========================================

if not RESEND_API_KEY:

    print(
        "RESEND_API_KEY NOT FOUND"
    )

else:

    resend.api_key = RESEND_API_KEY

    print(
        "RESEND API KEY LOADED"
    )


# =========================================
# SEND EMAIL
# =========================================

async def send_email(
    subject: str,
    email: str,
    body: str
):

    try:

        response = resend.Emails.send({

            "from": "SupportHub <onboarding@resend.dev>",

            "to": [email],

            "subject": subject,

            "html": body

        })

        print(
            "EMAIL SENT SUCCESSFULLY"
        )

        print(
            "EMAIL RESPONSE =>",
            response
        )

        return {

            "success": True,

            "response": response

        }

    except Exception as e:

        print(
            "EMAIL SENDING FAILED =>",
            str(e)
        )

        # IMPORTANT:
        # DO NOT CRASH BACKEND

        return {

            "success": False,

            "error": str(e)

        }
    