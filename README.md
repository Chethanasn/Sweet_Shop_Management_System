# Sweet_Shop_Management_System
Sweet Shop Management System
Overview

The Sweet Shop Management System is a full-stack web application designed to efficiently manage sweet inventory, purchases, and user roles (Admin & User).
It provides a clean and modern interface for managing sweets, viewing stock, purchasing items, and performing administrative actions like adding, updating, deleting, and restocking sweets.

🧩 Features
👤 User Features

Register and Login as a user or admin.

View available sweets and filter/search them by name or category.

Purchase sweets (quantity decreases automatically).

Responsive and user-friendly dashboard.

🛠️ Admin Features

Add new sweets with name, category, price, and quantity.

Edit or delete existing sweets.

Restock items (quantity increases).

Manage the entire inventory with secure admin access.

🔐 Authentication

JWT-based authentication for secure access.

Role-based routing (separate dashboards for Admin and User).

Password hashing using bcrypt.

Forgot Password and Reset Password functionality with secure email links.

🧠 Tech Stack
Layer	Technology Used
Frontend	React, TypeScript, TailwindCSS, Axios, React Router
Backend	Node.js, Express.js, Prisma ORM
Database	PostgreSQL
Authentication	JWT, bcryptjs
Email Service	Nodemailer (Gmail App Password)
Testing	Jest (for API tests)
🧱 System Architecture
Frontend (React + Axios)
        ↓
Backend (Express + Prisma)
        ↓
PostgreSQL Database

⚙️ Project Setup Guide
🖥️ Prerequisites

Make sure you have installed:

Node.js (v18+)

PostgreSQL

npm or yarn

Git

🗄️ Backend Setup

Navigate to the backend folder

cd backend


Install dependencies

npm install


Create the .env file

DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/sweetshopdb"
JWT_SECRET="supersecretkey123"
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_gmail_app_password"


Run Prisma migrations

npx prisma migrate dev --name init


Start the backend

npm run dev


Your backend should now be running at http://localhost:5000

💻 Frontend Setup

Navigate to the frontend folder

cd frontend


Install dependencies

npm install


Start the frontend

npm run dev


Your frontend will run at http://localhost:5173

🧪 Running Tests

You can run backend API tests using Jest or Postman.

🧾 Example Test Commands
npm test


Test Coverage Includes:

User registration and login

Role-based access verification

CRUD operations for sweets

Purchase and restock actions

Test Report Example Output:

PASS  tests/auth.test.js
✓ should register user
✓ should login as admin
✓ should reject invalid password
PASS  tests/sweet.test.js
✓ should add sweet
✓ should update quantity after purchase
✓ should delete sweet (admin only)


📸 Screenshots
🔑 Login & Register

<img width="380" height="300" alt="Screenshot 2025-11-02 130741" src="https://github.com/user-attachments/assets/4064fc5e-bbd3-4368-b75f-7e69fd24cdca" />


🧍 User Dashboard

🧑‍💼 Admin Dashboard

📧 Password Reset


(Replace these image paths with your actual screenshots)



