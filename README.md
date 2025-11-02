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

<img width="380" height="300" alt="Screenshot 2025-11-02 130741" src="https://github.com/user-attachments/assets/4f469f7d-1e03-4d17-a22b-01ea443dbe13" />

 Register Page
 
-->User 


<img width="380" height="300" alt="Screenshot 2025-11-02 132629" src="https://github.com/user-attachments/assets/23544597-af9e-4df6-8196-5f4b1d682f43" />

 
-->Admin


<img width="380" height="300" alt="Screenshot 2025-11-02 132831" src="https://github.com/user-attachments/assets/4b33f6ab-f22e-402f-b9a1-9ca447353560" />



🧍 User Dashboard


<img width="380" height="300" alt="Screenshot 2025-11-02 133019" src="https://github.com/user-attachments/assets/291b19ee-c29f-4a45-9557-ebfc262cbe6d" />


🧑‍💼 Admin Dashboard


<img width="380" height="300" alt="Screenshot 2025-11-02 133115" src="https://github.com/user-attachments/assets/525dfc33-9713-44ee-9797-ff0dacf449bf" />

Forgot Password


<img width="428" height="880" alt="Screenshot 2025-11-02 133339" src="https://github.com/user-attachments/assets/bc0c34dc-0547-47d3-a41d-67dec8f527ab" />



<img width="427" height="907" alt="Screenshot 2025-11-02 133359" src="https://github.com/user-attachments/assets/f53cc9e1-8512-4652-87ed-00e9df73148c" />



Database


Role Database


<img width="1560" height="339" alt="Screenshot 2025-11-02 134100" src="https://github.com/user-attachments/assets/46add49c-239e-40c2-b550-d58fec65dd2c" />



Sweet Database


<img width="1510" height="278" alt="Screenshot 2025-11-02 134127" src="https://github.com/user-attachments/assets/6b8e30bd-def3-4422-8e02-0a597fd39dc2" />






📂 Folder Structure


<img width="574" height="300" alt="Screenshot 2025-11-02 134714" src="https://github.com/user-attachments/assets/12b127ac-a437-4895-8a88-04012de068b6" />



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





