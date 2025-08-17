# Rate My Store

**Rate My Store** is a full-stack web application that I developed (and named myself) as part of my internship.  
It allows users to rate and review stores, store owners to manage their stores, and admins to manage the entire system.

---

## Features
- Multi-role Authentication:  
  - User → Sign up, log in, browse stores, give ratings & reviews  
  - Store Owner → Manage store details & view feedback  
  - Admin → Manage users, stores, and view system stats  
- Secure Authentication: Password hashing with bcrypt, JWT-based authentication, Admin login with secret key  
- Store Management: Add, update, and delete store information, view feedback from users  
- Dashboards: Separate dashboards for each role —  
  - User Dashboard → Browse stores, give ratings & reviews  
  - Store Owner Dashboard → Manage store info, view feedback  
  - Admin Dashboard → Manage users, stores, and view system statistics (users, stores, reviews)  

---

## Tech Stack
Frontend: React + Vite, React Router, TailwindCSS  
Backend: Node.js, Express.js, Sequelize ORM  
Database: MySQL / PostgreSQL (depending on setup)  
Authentication: JWT, bcryptjs  

---

## Installation & Setup
Clone the repository:
```bash
git clone https://github.com/Omkark158/RateMyStore.git
cd RateMyStore


Backend setup:
cd backend
npm install


Create a .env file inside backend/ with:
PORT= port no
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=ratemystore
JWT_SECRET=your_jwt_secret
ADMIN_SECRET_KEY=your_admin_key


Start backend:
node servevr.js 


Frontend setup:
cd ../frontend
npm install
npm run dev

Project Structure:

RateMyStore/
│
├── backend/               # Backend (Node.js + Express + Sequelize)
│   ├── models/            # Sequelize models
│   ├── routes/            # Express routes
│   ├── controllers/       # Controllers
│   ├── migrations/        # Database migrations
│   ├── seeders/           # Database seeders
│   ├── .env               # Environment variables (ignored in Git)
│   └── server.js          # Entry point
│
├── frontend/              # Frontend (React + Vite)
│   ├── src/               # Components, pages, hooks
│   ├── public/            # Static assets
│   └── vite.config.js     # Vite config
|
├── .gitignore             # Git ignore file
├── package.json           # Main dependencies
└── README.md              # Documentation







