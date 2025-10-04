# 📊 Polling System – Nest.js Backend

This repository contains the **backend implementation** of a secure and role-based **Polling System**, built using **Nest.js** for the Machine Test Assignment.  

The system demonstrates:
- JWT authentication
- Role-based access control (Admin/User)
- Poll creation, voting, results
- Automatic poll expiry with scheduled jobs

---

## 🚀 Features

### 🔑 Authentication
- User **registration**, **login**, and **logout**
- Secure password hashing
- **JWT-based authentication** with expiry handling

### 👥 Role-Based Access
- **Admin**
  - Create new polls
  - Edit (active polls only), delete, and manage their polls
- **User**
  - View public polls
  - Access private polls (if invited)
  - Vote on active polls
  - View results of expired polls

### 📊 Polling System
- Polls can be **public** or **private**
- Poll duration (max **2 hours**) set at creation
- Users can see real-time vote counts
- Expired polls are locked for voting but results remain visible
- **Duplicate vote prevention**

### ⚙️ Implementation Details
- **JWT & Role Guards**: Protect routes and validate access
- **Functional Triggers**: Each poll action (create, edit, vote) secured with guards + validation
- **Job-Based Expiry System**: Cron jobs track poll lifetimes and automatically update polls as expired
- **Edge Cases**: Invalid inputs, duplicate votes, unauthorized access are blocked

---

## 🛠️ Tech Stack
- **Framework**: [Nest.js](https://nestjs.com/)
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT
- **Scheduler**: @nestjs/schedule (for poll expiry)

---

## 📂 Project Structure
src/
├── auth/ # Authentication & JWT logic
├── users/ # User management
├── polls/ # Poll creation, voting, results
├── common/ # Guards, decorators, interceptors
└── app.module.ts # Root module


---

# # NOTE :   ------
 This project used ChatGPT for:

🏗️ Schema Design → Suggestions for MongoDB models (User, Poll, Vote)

🛡️ Roles Management → Guidance on implementing role-based guards (Admin vs User)

All other logic, coding, and testing were implemented manually.
This selective use of AI tools helped speed up initial design decisions while keeping the implementation

## ⚙️ Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation
```bash
# Clone repo
git clone https://github.com/Rahmathullaaiman/polling_backend.git
cd polling_backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# (Update DB_URI, JWT_SECRET, etc.)

# Development
npm run start:dev

📩 Submission

GitHub Repo: https://github.com/Rahmathullaaiman/polling_backend.git
