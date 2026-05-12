from fastapi_mail import ConnectionConfig


conf = ConnectionConfig(

    MAIL_USERNAME="navaneethkaku@gmail.com",

    MAIL_PASSWORD="zcdlsrbtybpxyykr",

    MAIL_FROM="navaneethkaku@gmail.com",

    MAIL_PORT=587,

    MAIL_SERVER="smtp.gmail.com",

    MAIL_STARTTLS=True,

    MAIL_SSL_TLS=False,

    USE_CREDENTIALS=True,

    VALIDATE_CERTS=True
)