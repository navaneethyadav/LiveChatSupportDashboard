from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from datetime import datetime

import os

from app.db.deps import get_db

from app.models.users import User
from app.models.password_reset_token import PasswordResetToken

from app.schemas.user_schema import (
    UserCreate,
    UserLogin,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    EmailVerificationRequest,
    ResendVerificationRequest
)

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    generate_reset_token,
    hash_reset_token,
    get_reset_token_expiry,
    validate_password_strength,
    create_email_verification_token,
    verify_email_verification_token
)

from app.services.email_service import send_email


router = APIRouter()


@router.post("/signup")
async def signup(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    validate_password_strength(
        user.password
    )

    hashed_password = hash_password(
        user.password
    )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hashed_password,
        is_verified=False
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    verification_token = create_email_verification_token(
        new_user.email
    )

    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )

    verification_link = (
        f"{frontend_url}/verify-email/{verification_token}"
    )

    email_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif;">

            <h2>Verify Your Email</h2>

            <p>Hello {new_user.full_name},</p>

            <p>
                Welcome to SupportHub.
            </p>

            <p>
                Please verify your email address by clicking
                the button below:
            </p>

            <a
                href="{verification_link}"
                style="
                    display: inline-block;
                    padding: 12px 20px;
                    background-color: #06b6d4;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                "
            >
                Verify Email
            </a>

            <p style="margin-top:20px;">
                Or copy and paste this link:
            </p>

            <p>
                {verification_link}
            </p>

            <p>
                This verification link will expire in 24 hours.
            </p>

        </body>
    </html>
    """

    await send_email(
        subject="Verify Your Email",
        email=new_user.email,
        body=email_body
    )

    return {
        "message": "Account created successfully. Verification email sent.",
        "user_id": new_user.id
    }


@router.post("/verify-email")
def verify_email(
    payload: EmailVerificationRequest,
    db: Session = Depends(get_db)
):

    email = verify_email_verification_token(
        payload.token
    )

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.is_verified:

        return {
            "message": "Email already verified"
        }

    user.is_verified = True

    db.commit()

    return {
        "message": "Email verified successfully"
    }


@router.post("/resend-verification")
async def resend_verification(
    payload: ResendVerificationRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == payload.email
    ).first()

    if not user:

        return {
            "message": "If account exists, verification email sent"
        }

    if user.is_verified:

        return {
            "message": "Email already verified"
        }

    verification_token = create_email_verification_token(
        user.email
    )

    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )

    verification_link = (
        f"{frontend_url}/verify-email/{verification_token}"
    )

    email_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif;">

            <h2>Email Verification</h2>

            <p>Hello {user.full_name},</p>

            <p>
                Click below to verify your email:
            </p>

            <a
                href="{verification_link}"
                style="
                    display: inline-block;
                    padding: 12px 20px;
                    background-color: #06b6d4;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                "
            >
                Verify Email
            </a>

            <p style="margin-top:20px;">
                Or copy and paste this link:
            </p>

            <p>
                {verification_link}
            </p>

        </body>
    </html>
    """

    await send_email(
        subject="Verify Your Email",
        email=user.email,
        body=email_body
    )

    return {
        "message": "Verification email sent successfully"
    }


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:

        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        existing_user.password
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )

    if not existing_user.is_verified:

        raise HTTPException(
            status_code=403,
            detail="Please verify your email before login"
        )

    access_token = create_access_token(
        data={
            "sub": existing_user.email,
            "role": existing_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": existing_user.role,
        "full_name": existing_user.full_name,
        "email": existing_user.email,
        "user_id": existing_user.id
    }


@router.post("/forgot-password")
async def forgot_password(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == payload.email
    ).first()

    if not user:

        return {
            "message": "If account exists, reset email sent successfully"
        }

    raw_token = generate_reset_token()

    hashed_token = hash_reset_token(
        raw_token
    )

    reset_token = PasswordResetToken(
        user_id=user.id,
        token_hash=hashed_token,
        expires_at=get_reset_token_expiry(),
        used=False
    )

    db.add(reset_token)

    db.commit()

    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )

    reset_link = (
        f"{frontend_url}/reset-password/{raw_token}"
    )

    email_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif;">

            <h2>Password Reset Request</h2>

            <p>Hello {user.full_name},</p>

            <p>
                You requested a password reset for your account.
            </p>

            <p>
                Click the button below to reset your password:
            </p>

            <a
                href="{reset_link}"
                style="
                    display: inline-block;
                    padding: 12px 20px;
                    background-color: #06b6d4;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                "
            >
                Reset Password
            </a>

            <p style="margin-top:20px;">
                Or copy and paste this link into your browser:
            </p>

            <p>
                {reset_link}
            </p>

            <p>
                This link will expire in 30 minutes.
            </p>

            <p>
                If you did not request this reset,
                please ignore this email.
            </p>

        </body>
    </html>
    """

    await send_email(
        subject="Reset Your Password",
        email=user.email,
        body=email_body
    )

    return {
        "message": "If account exists, reset email sent successfully"
    }


@router.post("/reset-password")
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    hashed_token = hash_reset_token(
        payload.token
    )

    reset_record = db.query(
        PasswordResetToken
    ).filter(
        PasswordResetToken.token_hash == hashed_token
    ).first()

    if not reset_record:

        raise HTTPException(
            status_code=400,
            detail="Invalid reset token"
        )

    if reset_record.used:

        raise HTTPException(
            status_code=400,
            detail="Reset token already used"
        )

    if reset_record.expires_at < datetime.utcnow():

        raise HTTPException(
            status_code=400,
            detail="Reset token expired"
        )

    validate_password_strength(
        payload.new_password
    )

    user = db.query(User).filter(
        User.id == reset_record.user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.password = hash_password(
        payload.new_password
    )

    reset_record.used = True

    db.commit()

    return {
        "message": "Password reset successful"
    }
    