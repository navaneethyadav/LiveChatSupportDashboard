Markdown
# Live Chat Support Dashboard

Enterprise-level full-stack support desk and live chat management platform built using FastAPI, React.js, PostgreSQL, and WebSockets.

---

# Features

## Authentication & Security
- JWT Authentication
- Protected Routes
- Role-Based Access Control (RBAC)
- Admin / Support / User Roles
- Auto Session Logout Handling

## Dashboard & Analytics
- Ticket Analytics
- Real-Time Statistics
- Interactive Charts
- Live Activity Logs
- Dashboard Loading States

## Ticket Management
- Create Tickets
- Assign Tickets
- Resolve Tickets
- Delete Tickets
- Priority Management
- Search & Filter Tickets
- Empty State Handling

## Live Chat System
- WebSocket Real-Time Chat
- Persistent Chat History
- Multi-User Chat Support
- Professional Chat UI

## Admin Management
- Users Management Panel
- Dynamic Role Management
- Enterprise Admin Dashboard
- Admin Route Protection

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
- React Router DOM
- Recharts
- React Hot Toast
- React Icons

## Backend
- FastAPI
- SQLAlchemy
- WebSockets
- JWT Authentication
- Passlib
- Pydantic

## Database
- PostgreSQL (Neon)

## Deployment
- Vercel (Frontend)
- Render (Backend)

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
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

## Backend `.env`

```env
DATABASE_URL=your_postgresql_database_url

SECRET_KEY=your_secret_key

MAIL_USERNAME=your_email

MAIL_PASSWORD=your_app_password
```

---

# Deployment

## Frontend
Vercel

## Backend
Render

## Database
Neon PostgreSQL

---

# Live Demo

Frontend:
https://live-chat-support-dashboard.vercel.app/

Backend:
https://livechatsupportdashboard.onrender.com

---

# GitHub Repository

https://github.com/navaneethyadav/LiveChatSupportDashboard

---

# Core Modules

- Authentication System
- Ticket Management
- Live Chat
- Dashboard Analytics
- Admin Panel
- Notifications
- Activity Logs
- AI Chatbot
- CSV Export System
- Role-Based Access Control

---

# Production Features

- Responsive UI
- Loading States
- Empty State Handling
- Auto Logout Session Handling
- Secure API Communication
- Protected Admin Routes
- Real-Time Communication
- Cloud Deployment

---

# Future Improvements

- File Upload Support
- Advanced Analytics
- AI Ticket Suggestions
- Push Notifications
- Dark/Light Theme Toggle

---

# Author

Navaneeth Kaku

Aspiring Full Stack Developer | Python & React Developer | Data Analyst
