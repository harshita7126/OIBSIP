# CraveCrust — Gourmet Woodfire Artisan & Store Telemetry Platform

CraveCrust is a full-stack artisan pizza e-commerce platform and store telemetry system featuring an interactive 2D Woodfire Builder, real-time stock deduction, Razorpay online payments, 6-digit email OTP verification, role-based staff administration, and automated low-stock background monitoring.

Completed as part of the Oasis Infobyte Student Internship Program (OIBSIP).

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Axios
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs
- **Integrations**: Razorpay API, Nodemailer SMTP, Node-Cron Scheduler

## Project Structure
- `src/` — React frontend SPA application
- `server/` — Express backend REST API & Mongoose models

## Local Setup

```bash
# 1. Install & start backend (Port 5000)
cd server
npm install
npm run dev

# 2. Install & start frontend (Port 5173)
# (From repository root in a separate terminal)
npm install
npm run dev
```

