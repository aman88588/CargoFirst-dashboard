## CargoFirst Dashboard

Modern full‑stack dashboard for managing user authentication and job postings. Built with React + Vite + TypeScript on the frontend and Express + MongoDB on the backend, secured with JWT‑based authentication.

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite, React Router, @tanstack/react-query, Tailwind CSS, shadcn/ui (Radix UI), Axios
- **Backend**: Node.js, Express, Mongoose, JSON Web Tokens (JWT), bcrypt, CORS, dotenv
- **Database**: MongoDB (Mongoose ODM)
- **Tooling**: ESLint, Nodemon, Vite

### Key Features
- **Authentication**: Signup, Signin, JWT issuance and storage, protected routes
- **Profile**: Fetch authenticated user profile
- **Job Management**: Create, list (with filters, sort, pagination), update, delete job postings
- **Secure APIs**: Role and identity stored in JWT; backend middleware validates Bearer tokens
- **DX**: React Query for data fetching, shadcn/ui components, clean project structure

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or bun/pnpm if desired)
- MongoDB database (local or hosted)

### Environment Variables
Create a `.env` file in `backend/` with:

```bash
PORT=5000
NODE_ENV=development
DEV_MONGODB_URI=<your-mongodb-secret>
JWT_SECRET_KEY=your-strong-secret
```

### Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in a separate terminal)
cd ../frontend
npm install
```

### Run Locally

```bash
# Start backend (http://localhost:5000)
cd backend
npm run dev

# Start frontend (http://localhost:5173 by default)
cd ../frontend
npm run dev
```

If your backend runs on a different URL/port in development, update the frontend API base URL in `frontend/src/lib/api.ts`.

---

## API Overview
Base URL: `/api/v1`

### Auth
- `POST /auth/signup`
  - Body: `{ email, password, role, address? }`
  - Returns: `{ success, message, data: { userId, email, role, address, memberSince, token } }`
- `POST /auth/signin`
  - Body: `{ email, password }`
  - Returns: `{ success, message, data: { userId, email, role, address, memberSince, token } }`
- `GET /auth/profile` (protected)
  - Header: `Authorization: Bearer <jwt>`
  - Returns: `{ success, message, data: { userId, email, role, address, memberSince } }`

### Jobs (protected)
- `POST /dashboard/create`
  - Body: `{ jobTitle, jobDescription, lastDateToApply, companyName }`
  - Validates future date for `lastDateToApply`
- `PUT /dashboard/update/:id`
  - Body: optional subset of `{ jobTitle, jobDescription, lastDateToApply, companyName }`
- `DELETE /dashboard/delete/:id`
- `GET /dashboard/list`
  - Query: `page`, `limit`, `companyName`, `jobTitle`, `sortBy`, `order`
  - Returns: `{ jobs, pagination: { currentPage, totalPages, totalJobs, jobsPerPage } }`

### Auth & Authorization Flow
- Backend issues a JWT on signup/signin using `JWT_SECRET_KEY` and 24h expiry.
- Frontend stores the token in `localStorage` and adds `Authorization: Bearer <token>` via an Axios interceptor.
- Protected backend routes use `AuthMiddleware` to verify and decode JWT (`userId`, `email`, `role`) and attach `req.user`.
- Frontend routes under `/dashboard` are wrapped by `ProtectedRoute` which redirects to `/signin` when not authenticated.

---

## Frontend

### Highlights
- Routing: `/`, `/signup`, `/signin`, `/dashboard`, `/dashboard/profile`, `/dashboard/analysis`
- Providers: React Query, Auth Context, Tooltip, Toasters
- Protected Layout: `DashboardLayout` behind `ProtectedRoute`

### Config
- API base URL is set in `frontend/src/lib/api.ts`.

---

## Backend

### Structure
- `server.js`: Express app, middleware, route mounting, DB connection
- `src/database/db.connect.js`: Mongoose connect using `DEV_MONGODB_URI`
- `src/middlewares/auth.middleware.js`: JWT verification (Bearer token)
- `src/controllers/*`: Auth and Job CRUD controllers
- `src/models/*`: `users`, `jobs` schemas
- `src/routers/v1/*`: `/auth` and `/dashboard` route modules

### Scripts
```bash
npm run dev   # nodemon
npm start     # node server.js
```

---

## Deployment
- **Backend**: Railway (configured base URL used by frontend)
  - Example used in code: `https://cargofirst-dashboard-productio-backend.up.railway.app/api/v1`
- **Frontend**: Any static host (Vercel, Netlify, Cloudflare Pages). Build with `npm run build` and deploy `dist/`.

Update the frontend API base URL per environment (dev/staging/prod).

---

## Folder Structure
```text
cargofirst-dashboard/
├─ backend/
│  ├─ server.js
│  └─ src/
│     ├─ controllers/
│     ├─ database/
│     ├─ middlewares/
│     ├─ models/
│     └─ routers/
└─ frontend/
   ├─ index.html
   └─ src/
      ├─ components/
      ├─ contexts/
      ├─ lib/
      ├─ pages/
      └─ App.tsx
```

---

## A Special Note

Thank you for giving me the opportunity to work on this project and for taking the time to review it. I sincerely appreciate your consideration and the effort you’ve put into evaluating my work.
I’m truly excited about the possibility of contributing further and look forward to hearing your feedback.

**The End**