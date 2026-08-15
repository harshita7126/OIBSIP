# CraveCrust — Gourmet Woodfire Artisan & Store Telemetry Platform

CraveCrust is a full-stack pizza ordering and real-time kitchen inventory management web application. Built on the MERN stack (MongoDB, Express.js, React, Node.js), it provides a complete consumer ordering flow alongside an administrative operations suite with automated inventory tracking and low-stock alerting.

---

## Live Demo

- **Frontend Application:** `http://localhost:5173` *(Local Dev)* / [Render Static Site Deployment]
- **Backend API Server:** `http://localhost:5000/api` *(Local Dev)* / [Render Web Service Deployment]

---

## Technical Overview & Features

### Customer Portal

- **User Authentication:** Registration with 6-digit email OTP verification, JWT-based sessions, and secure password hashing via `bcryptjs`.
- **Password Recovery:** Forgot password flow utilizing timed email reset tokens and SHA-256 hash validation.
- **Dynamic Menu Discovery:** Real-time search, category filtering (*Signature*, *Veggie*, *Meat Lovers*, *Crust Specials*), and dynamic size pricing.
- **Interactive 4-Step Pizza Builder:**
  - Step 1: Crust Base selection (5 varieties)
  - Step 2: Sauce selection (5 varieties)
  - Step 3: Cheese selection
  - Step 4: Vegetable & topping multi-selection (automatically cross-references live MongoDB ingredient quantities to disable out-of-stock items)
- **Dynamic Cart & Pricing:** Real-time subtotal calculation, itemized tax (5%), delivery fees, and discount promo code support (`CRAVE50`).
- **Simulated Payment Gateway:** Authentic Razorpay modal checkout supporting Card, UPI, and NetBanking test payments with server-side HMAC-SHA256 signature verification.
- **Live Order Tracking:** Step-by-step visual order lifecycle tracker (*Received* &rarr; *Preparing* &rarr; *Woodfire Oven* &rarr; *Out for Delivery* &rarr; *Delivered*) with driver assignment card.

### Admin Operations Suite

- **Role-Based Access Control:** Separate administrative portal for Store Owners (`owner`), Store Managers (`manager`), Kitchen Staff (`kitchen`), and Support (`support`).
- **Live Order Stream:** Real-time dashboard to monitor incoming orders and transition order dispatch statuses.
- **Automated Inventory Tracking:** Database ingredient deduction of bases, sauces, cheeses, and toppings upon verified order placement.
- **Manual Stock Management:** Dynamic stock increment/decrement and custom threshold configuration in MongoDB.
- **Scheduled Low-Stock Alerting:** Background worker running periodic checks via `node-cron` every 15 minutes to detect inventory below threshold levels and trigger automated Nodemailer email warnings.

---

## Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 8, Tailwind CSS v3, Framer Motion, Lucide React, Axios |
| **Backend** | Node.js, Express.js, CORS, Dotenv |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js, Crypto |
| **Payments** | Razorpay SDK (Test Mode / Checkout Integration) |
| **Email Delivery** | Nodemailer (SMTP / Gmail App Passwords) |
| **Task Scheduling** | `node-cron` (Automated 15-Minute Low-Stock Scanning) |
| **Deployment** | Render Static Site (Frontend), Render Web Service (Backend), MongoDB Atlas (Database) |

---

## System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           REACT FRONTEND (Vite)                         │
│   Auth Context │ Cart Context │ Pizza Builder │ Order Tracking UI       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Axios HTTP Requests (Bearer JWT)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         NODE.JS / EXPRESS BACKEND                       │
│  Controllers │ JWT Auth Middleware │ Stock Manager │ Payment Verifier   │
└────────────┬───────────────────────┬──────────────────────┬─────────────┘
             │                       │                      │
             ▼                       ▼                      ▼
┌─────────────────────────┐ ┌──────────────────┐ ┌────────────────────────┐
│      MONGODB ATLAS      │ │   RAZORPAY API   │ │   NODEMAILER (SMTP)    │
│ Users, Products, Orders,│ │ Order Creation & │ │ OTP & Low-Stock Alerts │
│ Inventories Collections │ │ HMAC Verification│ │ Automated Background   │
└─────────────────────────┘ └──────────────────┘ └────────────────────────┘
```

---

## Project Directory Structure

```text
CraveCrust/
├── index.html                  # Main HTML entry point
├── package.json                # Frontend dependencies & scripts
├── vite.config.js              # Vite server & proxy configuration
├── tailwind.config.js          # Tailwind CSS theme tokens
├── src/                        # React Frontend Source Root
│   ├── api/                    # Axios API client setup & auth HTTP services
│   ├── components/             # Reusable UI components (Navbar, Footer, Modals, Builder)
│   ├── context/                # Global React contexts (Auth, Cart, Builder, Toast)
│   ├── pages/                  # Page route views (Admin, Public, User)
│   ├── services/               # Frontend business logic service wrappers
│   └── utils/                  # Image resolution & initials helpers
└── server/                     # Express Backend Root
    ├── config/                 # Database connection configuration (db.js)
    ├── controllers/            # API Controllers (auth, order, inventory, builder)
    ├── middleware/             # Auth JWT middleware & role authorization
    ├── models/                 # Mongoose schemas (User, Product, Order, Inventory, Driver)
    ├── routes/                 # Express router modules
    ├── services/               # Low-stock monitoring alert service
    ├── utils/                  # Background node-cron scheduler & email service
    ├── package.json            # Backend dependencies & scripts
    └── server.js               # Express application entry point
```

---

## Application Workflow

1. **Onboarding & Auth**: User registers an account, receives a 6-digit OTP via email, verifies the OTP to activate the account, and signs in to receive a 7-day JWT token.
2. **Menu & Custom Builder**: Customer browses signature pizzas or uses the 4-step interactive builder to craft a custom pizza.
3. **Cart & Checkout**: User confirms delivery details and reviews the itemized order summary.
4. **Payment & Verification**: Razorpay processes test payment; backend validates the HMAC-SHA256 signature, creates the order in MongoDB, and deducts ingredient quantities from inventory.
5. **Kitchen Operations & Tracking**: Order appears on the Admin Order Stream. Kitchen staff updates status to *In Oven* / *Out for Delivery*, which syncs to the customer's Order Tracking timeline.

---

## API Endpoint Reference

| Method | Endpoint | Purpose | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new customer account | No |
| `POST` | `/api/auth/verify-otp` | Verify email with 6-digit numeric OTP | No |
| `POST` | `/api/auth/resend-otp` | Resend 6-digit OTP verification code | No |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT bearer token | No |
| `POST` | `/api/auth/forgot-password` | Send password reset token email link | No |
| `POST` | `/api/auth/reset-password` | Update password using SHA-256 reset token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (User) |
| `GET` | `/api/products` | Fetch menu pizzas catalog | No |
| `GET` | `/api/builder/options` | Fetch builder options with live stock status | No |
| `POST` | `/api/payments/create-order` | Generate Razorpay order ID | No |
| `POST` | `/api/payments/verify` | Cryptographically verify HMAC payment signature | No |
| `POST` | `/api/orders` | Validate availability, create order, deduct stock | Yes (User/Guest) |
| `GET` | `/api/orders/:id` | Fetch live order tracking status | No / Protected |
| `GET` | `/api/orders` | Fetch full order stream | Yes (Staff) |
| `PUT` | `/api/orders/:id` | Update order dispatch status | Yes (Staff) |
| `GET` | `/api/inventory` | View all ingredient stock levels | No / Admin |
| `PUT` | `/api/inventory/:id` | Manually adjust item stock & alert threshold | Yes (Staff) |

---

## Environment Variables Configuration

### Backend (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/cravecrust
JWT_SECRET=your_secure_production_jwt_secret_key
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_FROM="CraveCrust <your_email@gmail.com>"
ADMIN_EMAIL=your_admin_notification_email@gmail.com
CLIENT_BASE_URL=https://your-frontend-app.onrender.com
```

### Frontend (`.env` or Render Static Site Env)

```env
VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
```

---

## Local Development Instructions

### Prerequisites

- Node.js (v18.x or higher)
- MongoDB Atlas cluster connection string

### Step-by-Step Local Run

1. **Clone Repository:**

   ```bash
   git clone https://github.com/harshita7126/OIBSIP.git
   cd OIBSIP
   ```

2. **Start Backend Server:**

   ```bash
   cd server
   npm install
   # Create server/.env file using template above
   npm run dev
   ```

3. **Start Frontend Client:**

   ```bash
   # In a separate terminal from root directory
   npm install
   npm run dev
   ```

4. **Access Applications:**
   - **Frontend App:** `http://localhost:5173`
   - **Backend API:** `http://localhost:5000/api`

---

## Internship Submission Details

| Property | Submission Detail |
| :--- | :--- |
| **Intern Name** | Harshita Labba |
| **Assigned Track** | Web Development & Designing |
| **Project Level** | Level 3 (Full-Stack Application) |
| **Project Title** | Pizza Delivery Full-Stack Application (CraveCrust) |
| **Repository Name** | `OIBSIP` |
| **Batch Provider** | Oasis Infobyte |

---

## License & Acknowledgments

This project is developed as part of the **Oasis Infobyte Student Internship Program (OIBSIP)** under the Web Development & Designing Track.

- **License:** [MIT License](https://opensource.org/licenses/MIT)
- **Acknowledgments:** Special thanks to Oasis Infobyte for providing project specifications and guidance.