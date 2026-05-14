# Live Chat Support Dashboard

Enterprise-level full-stack support desk and live chat management platform built using FastAPI, React.js, PostgreSQL, WebSockets, and JWT Authentication.

---

# Live Demo

## Frontend
https://live-chat-support-dashboard.vercel.app/

## Backend
https://livechatsupportdashboard.onrender.com

---

# GitHub Repository

https://github.com/navaneethyadav/LiveChatSupportDashboard

---

# Features

## Authentication & Security

- JWT Authentication
- Protected Routes
- Role-Based Access Control (RBAC)
- Admin / User Roles
- Auto Session Logout
- Email Verification
- Forgot Password
- Reset Password
- Password Strength Validation

---

## Dashboard & Analytics

- Ticket Analytics
- Real-Time Statistics
- Interactive Charts
- Activity Logs
- Dashboard Loading States

---

## Ticket Management

- Create Tickets
- Assign Tickets
- Resolve Tickets
- Delete Tickets
- Ticket Priority Management
- Search & Filter Tickets
- Empty State Handling

---

## File Management

- Ticket Attachment Upload
- Attachment Preview
- Attachment Download/Open Support

---

## Live Chat System

- Real-Time WebSocket Chat
- Persistent Chat History
- Multi-User Support Chat
- Professional Chat UI

---

## Admin Management

- Users Management Panel
- Dynamic Role Management
- Enterprise Admin Dashboard
- Protected Admin Routes

---

## Notifications & Reporting

- Notification Center
- CSV Export Reports
- Enterprise Logs System

---

## Email Automation

- Ticket Created Email
- Ticket Assigned Email
- Ticket Resolved Email
- Verification Email
- Password Reset Email

---

## AI Chatbot

- FAQ Chatbot
- Smart Auto Replies
- Support Assistant API

---

# Tech Stack

## Frontend

- React.js
- Tailwind CSS
- Axios
- React Router DOM
- Recharts
- React Hot Toast
- React Icons

---

## Backend

- FastAPI
- SQLAlchemy
- WebSockets
- JWT Authentication
- Passlib
- Pydantic

---

## Database

- PostgreSQL (Neon)

---

## Deployment

- Vercel (Frontend)
- Render (Backend)
- Neon PostgreSQL Cloud Database

---

# Project Architecture

User → Ticket System → Support Team → Status Tracking → Resolution → Feedback

---

# Installation

## Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
