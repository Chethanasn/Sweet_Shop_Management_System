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
 Login Page 

<img width="380" height="300" alt="Screenshot 2025-11-02 130741" src="https://github.com/user-attachments/assets/4064fc5e-bbd3-4368-b75f-7e69fd24cdca" />

 Register Page
 
-->User 


 <img width="380" height="300" alt="image" src="https://github.com/user-attachments/assets/d0f586a8-72b5-4f5e-b846-e021fc828086" />

 
-->Admin


<img width="380" height="300" alt="image" src="https://github.com/user-attachments/assets/e8ea40ee-e8cd-489d-90a6-4ec80f077238" />



🧍 User Dashboard


<img width="380" height="300" alt="image" src="https://github.com/user-attachments/assets/6dca19d0-ca86-4766-a1a3-dce54b5d9611" />


🧑‍💼 Admin Dashboard


<img width="380" height="300" alt="image" src="https://github.com/user-attachments/assets/1ac96b80-6b83-44b8-a2a2-7069c7515b02" />

Forgot Password


<img width="380" height="300" alt="Screenshot 2025-11-02 133339" src="https://github.com/user-attachments/assets/0b025f6c-5c29-470b-9e75-1eb06408ec7b" />



<img width="380" height="300" alt="image" src="https://github.com/user-attachments/assets/fe20dd54-632b-4cd3-b83a-569c4741ba46" />



Database


Role Database


<img width="1560" height="339" alt="Screenshot 2025-11-02 134100" src="https://github.com/user-attachments/assets/c1170c6c-668e-4365-9bb1-1709ca67964b" />


Sweet Database


<img width="1560" height="278" alt="Screenshot 2025-11-02 134127" src="https://github.com/user-attachments/assets/9b58a905-ae00-4aec-890a-fb06d5d6a810" />





📂 Folder Structure


<img width="574" height="703" alt="image" src="https://github.com/user-attachments/assets/cefac21d-767a-44cd-9df2-07aef91003ec" />



🤖 My AI Usage

In this section, I describe how AI tools assisted me throughout the development process.

🧠 Tools Used

ChatGPT (GPT-5 by OpenAI)

GitHub Copilot

💡 How I Used Them

I used ChatGPT extensively during the planning and development stages:

To generate and refine the Express.js routes for authentication and sweets CRUD.

To debug Prisma migration errors and design a consistent database schema.

To help create clean and reusable React components for login, register, and dashboards.

For generating setup documentation and project explanation (this README section).


Auto-completing small code snippets inside React forms.

Suggesting Tailwind class combinations to improve UI consistency.

Writing repetitive try-catch structures and axios calls.

🪄 Reflection on AI Impact

AI tools significantly improved my productivity:

They reduced development time by helping me debug Prisma, Node, and frontend state errors faster.

The generated code was accurate, and I learned best practices for authentication and REST API design.

However, I ensured that I understood and verified every AI suggestion — editing logic, handling security, and customizing UI manually.

Overall, AI acted as a technical assistant, not a replacement. It enhanced my learning and allowed me to deliver a polished, functional project efficiently.

🏁 Conclusion

The Sweet Shop Management System demonstrates a well-structured full-stack implementation with role-based authentication, inventory control, and smooth UX.
It reflects modern web development practices — combining performance, usability, and security.

💬 Developed with using React, Node.js, Prisma, and the power of AI-assisted coding.



