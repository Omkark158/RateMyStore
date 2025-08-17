# Rate My Store

* **Rate My Store** is a full-stack web application that allows users to rate and review stores, store owners to manage their store profiles and monitor feedback, and administrators to oversee the entire system.  
* This project was assigned by **Roxiler Systems** as the first task in the selection process for the Full Stack Development internship.

---

## Features

* Multi-role Authentication
  * **User** → Sign up, log in, browse stores, submit ratings & reviews  
  * **Store Owner** → Manage store details, monitor customer feedback  
  * **Admin** → Manage users, stores, and view system-wide statistics  
* Secure Authentication using **JWT** & **bcrypt**  
* Store Management (Add, Update, Delete stores)  
* Separate Dashboards for each role  
  * User Dashboard → Browse stores, give ratings & reviews  
  * Store Owner Dashboard → Manage store information & feedback  
  * Admin Dashboard → Manage users, stores, and monitor system stats  

---

## Tech Stack

* **Frontend:** React (Vite), React Router, TailwindCSS  
* **Backend:** Node.js, Express.js, Sequelize ORM  
* **Database:** MySQL  
* **Authentication:** JWT, bcrypt  

---

 ## Project Structure
```bash                                          
 backend/
├── config/database.js
├── controllers/
│   ├── authController.js                  
│   ├── ownerController.js
│   ├── statsController.js
│   ├── storeController.js
│   └── userController.js
├── middleware/auth.js
├── models/
│   ├── index.js
│   ├── Rating.js
│   ├── Store.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── owner.js
│   ├── stats.js
│   ├── stores.js
│   └── users.js
├── .env
├── package.json
└── server.js
```
```bash  
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── FilterSort.jsx
│   │   ├── Layout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── RatingButtons.jsx
│   │   ├── StoreForm.jsx
│   │   └── UserForm.jsx
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── OwnerDashboard.jsx
│   │   ├── Register.jsx
│   │   └── UserDashboard.jsx
│   ├── utils/api.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js

```
---

## Setup Instructions

1. **Clone the repository**
    ```bash
    git clone https://github.com/Omkark158/RateMyStore.git
    cd RateMyStore
    ```

2. **Backend Setup**
    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file in the backend folder:
    ```
    PORT=port no
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=yourpassword
    DB_NAME=ratemystore
    JWT_SECRET=your_jwt_secret
    ADMIN_SECRET_KEY=your_admin_key
    ```

    Start backend:
    ```bash
    node server.js

3. **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

---
## UI Snapshots

Screenshots of the application are available in the `UI-snapshots - RateMyStore/` folder:

* Login Page  
* User Dashboard  
* Store Owner Dashboard  
* Admin Dashboard  
* Other key UI pages  

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint         | Description                 |
| :----- | :--------------- | :-------------------------- |
| POST   | /signup          | User registration           |
| POST   | /login           | User/Store Owner login      |
| POST   | /login/admin     | Admin login with secret key |
| PUT    | /update-password | Update user password        |

---

### Store Management (`/api/stores`)

| Method | Endpoint         | Description                             |
| :----- | :--------------- | :-------------------------------------- |
| GET    | /                | Public store listing with search/filter |
| POST   | /:id/rate        | Submit a rating for a store             |
| GET    | /stats           | Get store statistics (Admin only)       |
| POST   | /                | Create new store (Admin only)           |
| PUT    | /:id             | Update store details (Admin/Owner)      |
| DELETE | /:id             | Delete store (Admin only)               |
| GET    | /owner/dashboard | Store Owner analytics dashboard         |

---

### User Management (`/api/users`)

| Method | Endpoint | Description                 |
| :----- | :------- | :-------------------------- |
| GET    | /        | List all users (Admin only) |
| POST   | /        | Create new user (Admin only)|
| PUT    | /:id     | Update user (Admin only)    |
| DELETE | /:id     | Remove user (Admin only)    |

---
