# Live Chat Support Dashboard

Enterprise-level full-stack support desk and live chat management platform built using FastAPI, React.js, PostgreSQL, and WebSockets.

---

# Features

## Authentication & Security
- JWT Authentication
- Protected Routes
- Role-Based Access Control (RBAC)
- Admin / Support / User Roles

## Dashboard & Analytics
- Ticket Analytics
- Real-Time Statistics
- Interactive Charts
- Live Activity Logs

## Ticket Management
- Create Tickets
- Assign Tickets
- Resolve Tickets
- Delete Tickets
- Priority Management

## Live Chat System
- WebSocket Real-Time Chat
- Persistent Chat History
- Multi-User Chat Support

## Admin Management
- Users Management Panel
- Dynamic Role Management
- Enterprise Admin Dashboard

## Notifications & Reporting
- Notification Center
- CSV Export Reports
- Enterprise Logs System

## Email Automation
- Ticket Created Email
- Ticket Assigned Email
- Ticket Resolved Email

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
- Recharts

## Backend
- FastAPI
- SQLAlchemy
- WebSockets
- JWT Authentication

## Database
- PostgreSQL

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