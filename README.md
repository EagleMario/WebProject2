# 🏫 School Management System

A full-stack school management platform built with **Node.js**, **React**, and a **dual-database architecture** (PostgreSQL + MongoDB). It supports three user roles — **Manager**, **Teacher**, and **Student** — each with their own dedicated dashboard and feature set.

---

## ✨ Features

### 👨‍💼 Manager
- Full control over users (create, delete, manage students & teachers)
- Bulk student import via **CSV upload**
- Class creation & management (assign teachers, enroll students)
- Exam scheduling and exam management
- Grade oversight (exam & assignment grades)
- **Fee management** — assign, update, and delete student fees
- **Salary management** — manage teacher salaries
- View and manage dashboards with statistics
- Real-time notification delivery via **Socket.IO**

### 👩‍🏫 Teacher
- View assigned classes and students
- Create and manage **Lectures**
- Create **Exams** with custom questions
- Grade students on exams and assignments
- Post assignments with due dates
- Send notifications to students

### 🎓 Student
- View their enrolled classes and lectures
- See upcoming exams and exam schedules
- View their grades (exam + assignment) and **GPA**
- View their fee status (`/my-fees`)
- Receive real-time notifications

### 🤖 AI Chat Assistant
- Dual AI provider support: **OpenAI GPT-4o-mini** and **Google Gemini 1.5 Flash**
- Chat widget available across dashboards
- School-context-aware system prompt

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **Prisma ORM** | PostgreSQL data modeling & querying |
| **PostgreSQL** | Primary relational database (users, classes, exams, grades, GPA) |
| **MongoDB + Mongoose** | Secondary database (notifications, fees, salaries) |
| **Socket.IO** | Real-time bidirectional notifications |
| **BullMQ** | Background job queues (report card generation) |
| **ioredis / Upstash Redis** | Queue broker for BullMQ workers |
| **JSON Web Token (JWT)** | Authentication & authorization |
| **bcrypt** | Password hashing |
| **Multer** | File uploads (CSV import, file storage) |
| **csv-parser** | Parse CSV files for bulk student import |
| **OpenAI SDK** | GPT-4o-mini AI chat integration |
| **@google/generative-ai** | Gemini 1.5 Flash AI chat integration |
| **date-fns** | Date utilities |
| **uuid** | Unique ID generation |
| **dotenv** | Environment variable management |
| **cors** | Cross-Origin Resource Sharing |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **React Router v7** | Client-side routing & SPA navigation |
| **Axios** | HTTP client for API calls |
| **Socket.IO Client** | Real-time notifications on the frontend |
| **Lucide React** | Icon library |
| **date-fns** | Date formatting in UI |
| **Vanilla CSS** | Custom styling (no framework) |

### DevOps & Deployment
| Technology | Purpose |
|---|---|
| **Render** | Cloud deployment (configured via `render.yaml`) |
| **Nodemon** | Auto-restart in development |
| **TypeScript** | Type support for scripts |

---

## 🗄️ Database Architecture

This project uses a **hybrid database** approach:

### PostgreSQL (via Prisma)
Used for core relational data:
- `user` — all users with roles (`MANAGER`, `TEACHER`, `STUDENT`)
- `Class` — classes with teacher assignment and student enrollment
- `Lecture` — lectures linked to classes and teachers
- `Exam` — exams with questions, dates, duration, and total marks
- `ExamGrade` — per-student exam scores
- `Assignment` — teacher-created assignments with due dates
- `AssignmentGrade` — per-student assignment scores
- `Gpa` — calculated GPA per student

### MongoDB (via Mongoose)
Used for flexible, document-based data:
- `Notification` — real-time user notifications (title, message, read status)
- `Fee` (Fees module) — student fee records and payment status
- `Salary` (Salaries module) — teacher salary records

---

## 📁 Project Structure

```
New-School-Project/
├── Server.js               # Entry point: HTTP server, Socket.IO, DB connections
├── app.js                  # Express app setup, routes, middleware
├── render.yaml             # Render deployment configuration
├── prisma/
│   └── schema.prisma       # PostgreSQL schema (Prisma models)
├── Config/
│   ├── DB.js               # MongoDB connection
│   └── redisClient.js      # Redis / Upstash connection (graceful fallback)
├── src/
│   ├── Ai/                 # AI Chat (GPT + Gemini)
│   ├── Assignments/        # Assignment CRUD & grading
│   ├── Classes/            # Class management
│   ├── Core/
│   │   ├── MiddleWare/     # Auth middleware (protect, restrictTo)
│   │   ├── Queues/         # BullMQ queue definitions (reportQueue)
│   │   ├── Utils/          # AppError, CatchAsync helpers
│   │   └── Workers/        # BullMQ workers (reportWorker)
│   ├── Dashboards/         # Dashboard statistics endpoints
│   ├── Errors/             # Global error controller
│   ├── Exams/              # Exam creation & scheduling
│   ├── Fees/               # Fee assignment & management (MongoDB)
│   ├── Grades/             # Grade recording & retrieval
│   ├── Lectures/           # Lecture CRUD
│   ├── Managers/           # Manager-specific logic
│   ├── Notifications/      # Real-time notifications (MongoDB)
│   ├── Salaries/           # Salary management (MongoDB)
│   └── Users/              # User auth (register, login, JWT)
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx             # Router & protected routes
        ├── main.jsx            # React entry point
        ├── components/
        │   ├── AiChatWidget.jsx  # Floating AI chat widget
        │   └── Navbar.jsx        # Navigation bar
        ├── context/             # React context (auth, etc.)
        └── pages/
            ├── Login.jsx            # Login page
            ├── ManagerDashboard.jsx # Full manager interface
            ├── TeacherDashboard.jsx # Teacher interface
            └── StudentDashboard.jsx # Student interface
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.0.0
- **PostgreSQL** database
- **MongoDB** database (MongoDB Atlas or local)
- **Redis** (optional — needed only for BullMQ report card queues; app works without it)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/school-management-system.git
cd school-management-system
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
npm install --prefix frontend
```

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
# Server
PORT=3500
NODE_ENV=development

# PostgreSQL (Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/school_db

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/school

# JWT
JWT_SECRET=your_jwt_secret_here

# Redis (Optional — for BullMQ queues)
REDIS_URL=rediss://your-upstash-redis-url

# AI Providers (Optional)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
```

### 5. Run Prisma migrations
```bash
npx prisma migrate dev
```

### 6. Start the development server

**Backend:**
```bash
npm run dev
```

**Frontend (separate terminal):**
```bash
cd frontend
npm run dev
```

---

## 🌐 API Endpoints

| Prefix | Module |
|---|---|
| `/api/users` | Authentication (register, login) |
| `/api/classes` | Class management |
| `/api/exams` | Exam creation & retrieval |
| `/api/exam-schedule` | Exam scheduling |
| `/api/grades` | Grade entry & retrieval |
| `/api/dashboard` | Statistics & dashboard data |
| `/api/lectures` | Lecture management |
| `/api/notifications` | Notification fetch & mark-as-read |
| `/api/ai` | AI Chat (GPT / Gemini) |
| `/api/assignments` | Assignment management |
| `/api/fees` | Fee management |
| `/api/salaries` | Salary management |
| `/health` | Server health check |

---

## ⚙️ Background Jobs (BullMQ)

The app uses **BullMQ** with a **Redis** backend for processing heavy tasks asynchronously:

- **Queue:** `ReportCardsQueue` — queues report card generation jobs
- **Worker:** `reportWorker` — processes jobs with a concurrency of 5
- **Graceful fallback:** If `REDIS_URL` is not set, queues and workers are disabled automatically and the app runs normally

---

## 🔐 Authentication & Authorization

- JWT-based authentication using `jsonwebtoken`
- Passwords hashed with `bcrypt`
- Role-based access control via middleware:
  - `protect` — validates JWT and attaches user to request
  - `restrictTo(...roles)` — restricts routes to specific roles (`MANAGER`, `TEACHER`, `STUDENT`)

---

## 📡 Real-time Notifications (Socket.IO)

- Each user joins a personal **Socket.IO room** identified by their user ID on login
- Notifications are emitted directly to the user's room when triggered by manager/teacher actions
- The frontend listens using `socket.io-client` and shows live notification badges

---

## ☁️ Deployment (Render)

The app is configured for **Render** deployment via [`render.yaml`](./render.yaml):

- **Build Command:** `npm install && npm run build` (installs backend + builds frontend)
- **Start Command:** `npm start`
- **Frontend** is served as static files from `frontend/dist` by Express
- **SPA Fallback:** All non-API routes serve `index.html` for React Router support

Required environment variables on Render:
- `DATABASE_URL` — PostgreSQL Internal Database URL
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Secret for JWT signing
- `REDIS_URL` *(optional)* — Upstash Redis for BullMQ

---

## 📊 Data Import

The project includes a **CSV bulk import** feature for students:
- Template file: [`students_import_template.csv`](./students_import_template.csv)
- Managers can upload a CSV file to create multiple student accounts at once

---

## 📝 License

This project was built as a school project. Feel free to use it as a reference or base for your own school management systems.
