# ExpenseTrack

# 💰 Expense Tracker App

A full-stack expense tracking application built with **Vite + Tailwind CSS** on the frontend and **Node.js + Express + MongoDB** on the backend.

## 🔧 Tech Stack

### Frontend:
- Vite
- React
- Tailwind CSS
- Axios
- ESLint

### Backend:
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JSON Web Tokens (JWT)

## 🚀 Features

- 🔐 JWT-based User Authentication
- ➕ Add, Edit, Delete Expenses
- 📊 Visualize spending with charts
- ⚙️ Modular backend architecture (controllers, middlewares, config)
- 🌐 Responsive and optimized UI using Tailwind + Vite

## 📁 Project Structure

```bash
.
├── backend/
│   ├── config/               # DB and JWT configuration
│   ├── controllers/          # Auth and expense controllers
│   ├── middlewares/          # Authentication middleware
│   ├── app.js                # Main app setup
│   ├── server.js             # Entry point for backend
│   └── .env                  # Environment variables

├── frontend/
│   ├── index.html            # App entry HTML
│   ├── vite.config.js        # Vite config
│   ├── tailwind.config.js    # Tailwind config
│   └── src/                  # Main source code
│       ├── main.jsx              # Renders App
│       ├── App.jsx               # Root component with routing
│       ├── index.css            # Tailwind/global styles
│
│       ├── context/              # Global state management
│       │   ├── AuthContext.jsx       # Auth state
│       │   └── ExpenseContext.jsx    # Expense state
│
│       ├── components/           # Reusable UI components
│       │   ├── Layout.jsx            # Page layout wrapper
│       │   ├── ExpenseForm.jsx       # Add/edit expense form
│       │   └── Charts/               # Data visualizations
│       │       ├── ExpenseBarChart.jsx
│       │       └── ExpensePieChart.jsx
│
│       ├── pages/                # Application screens
│       │   ├── Dashboard.jsx         # Charts overview
│       │   ├── ExpenseList.jsx       # List of all expenses
│       │   ├── AddExpense.jsx        # Add expense form
│       │   ├── EditExpense.jsx       # Edit expense
│       │   ├── Login.jsx             # Login screen
│       │   ├── Register.jsx          # Signup screen
│       │   ├── ForgotPassword.jsx    # Password reset
│       │   ├── OtpVerification.jsx   # OTP auth
│       │   └── NotFound.jsx          # 404 fallback
│
│       ├── utils/                # Helper functions
│       │   ├── axiosInstance.js      # Configured Axios for API
│       │   └── constants.js          # App-wide constants
