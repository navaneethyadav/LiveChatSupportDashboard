import os

import resend

from dotenv import load_dotenv


load_dotenv()


resend.api_key = os.getenv("RESEND_API_KEY")


async def send_email(
    subject: str,
    email: str,
    body: str
):

    resend.Emails.send({

        "from": "SupportHub <onboarding@resend.dev>",

        "to": email,

        "subject": subject,

        "html": body

    })