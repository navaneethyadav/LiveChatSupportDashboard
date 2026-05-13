# Live Chat Support Dashboard

A full-stack real-time customer support dashboard built using FastAPI, React, PostgreSQL, and WebSockets.

---

# Features

## Authentication & Security
- JWT Authentication
- Role-Based Access Control
- Protected Routes
- Secure Password Hashing
- Token Validation
- Environment Variable Security

---

## Ticket Management
- Create Tickets
- Assign Tickets
- Resolve Tickets
- Delete Tickets
- Priority Filtering
- Search Functionality
- Admin/User Ticket Separation

---

## Live Chat System
- Real-Time WebSocket Chat
- Typing Indicators
- Chat Status Updates
- Admin/User Chat Filtering
- Secure Token-Based WebSocket Authentication

---

## Dashboard Features
- Ticket Analytics
- Live Statistics
- Notifications
- Activity Logs
- Responsive Admin Dashboard

---

## Feedback System
- Ticket Feedback Submission
- Ratings & Comments

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router
- React Hot Toast
- Recharts

---

## Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- WebSockets
- Alembic

---

# Project Structure

## Backend

```bash
backend/
├── alembic/
├── app/
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   └── main.py
├── requirements.txt
├── runtime.txt
└── .env
```

---

## Frontend

```bash
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── vercel.json
```

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

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

## Backend `.env`

```env
SECRET_KEY=your_secure_secret_key
```

---

# API Modules

- Authentication APIs
- Ticket APIs
- Dashboard APIs
- Feedback APIs
- Logs APIs
- Live Chat APIs
- Export APIs

---

# Main Features Implemented

- Real-time live chat using WebSockets
- JWT authentication system
- Admin/User role separation
- Ticket assignment workflow
- Responsive dashboard UI
- Notification system
- Secure API protection
- PostgreSQL database integration

---

# Screenshots

Add screenshots here:
- Dashboard
- Tickets Page
- Live Chat
- Admin Panel
- Mobile Responsive Layout

---

# Future Improvements

- Email Notifications
- AI Chatbot Improvements
- Sound Notifications
- Dark/Light Mode
- Docker Deployment
- Advanced Analytics

---

# Author

Navaneeth Kaku

---

# License

This project is for learning and portfolio purposes.