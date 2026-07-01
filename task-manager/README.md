# Task Manager App

A full-stack task manager with a Django REST backend and a React + Vite frontend.

## Project overview

- Backend: Django 5.2, Django REST Framework, JWT authentication, SQLite database
- Frontend: React 19, Vite, Tailwind CSS, React Router, Axios
- Features: user registration/login, protected dashboard, task CRUD operations

## Architecture

The application is split into two main layers:

- Backend API layer
  - Django application serves REST endpoints under `/api/`
  - `accounts` app handles registration, JWT login, token refresh, and profile retrieval
  - `tasks` app exposes CRUD operations for task resources with a DRF viewset
  - SQLite stores user and task data locally

- Frontend client layer
  - React + Vite single-page application
  - Routes for `/login`, `/register`, and `/`
  - `ProtectedRoute` component guards the dashboard route and redirects unauthenticated users
  - Axios services handle authentication and task API requests

Data flow

1. User registers or logs in on the frontend.
2. Frontend sends credentials to Django auth endpoints.
3. Backend returns JWT tokens and user profile data.
4. Frontend stores the access token locally and includes it in future API calls.
5. Task operations are sent to `/api/tasks/` and persisted by Django.
6. The dashboard reads tasks from the backend and renders them in the React UI.

## Repository structure

- `backend/`
  - `manage.py` - Django management entrypoint
  - `requirements.txt` - Python dependencies
  - `config/` - Django project settings and URLs
  - `accounts/` - authentication API, serializers, views
  - `tasks/` - task API, serializers, views

- `frontend/`
  - `package.json` - npm scripts and dependencies
  - `src/` - React application source files
  - `src/pages/` - login, register, dashboard pages
  - `src/components/` - reusable UI components and protected route wrapper
  - `src/services/` - auth and task API service modules

## Setup

### 1. Backend

1. Create and activate a Python virtual environment in the project root or inside `backend/`:

   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate
   ```

2. Install backend dependencies:

   ```powershell
   pip install -r requirements.txt
   ```

3. Run migrations:

   ```powershell
   python manage.py migrate
   ```

4. Start the backend server:

   ```powershell
   python manage.py runserver
   ```

   The API will be available at `http://127.0.0.1:8000/`.

### 2. Frontend

1. Install frontend dependencies:

   ```powershell
   cd frontend
   npm install
   ```

2. Start the frontend dev server:

   ```powershell
   npm run dev
   ```

   The React app typically runs at `http://localhost:5173`.

## Running the app

- Register a user using the `/register` page.
- Log in with email/credentials on the `/login` page.
- The dashboard is protected and requires a valid JWT token.

## API endpoints

- `POST /api/auth/register/` - create a new user
- `POST /api/auth/login/` - obtain JWT access/refresh tokens
- `POST /api/auth/refresh/` - refresh access token
- `GET /api/auth/profile/` - get profile information
- `GET /api/tasks/` - list tasks
- `POST /api/tasks/` - create a task
- `PUT /api/tasks/{id}/` - update a task
- `DELETE /api/tasks/{id}/` - delete a task

## Notes

- Ensure the backend server is running before using the frontend.
- If the frontend shows a blank page, check the browser console and confirm that API requests are returning expected responses.
- Adjust API base URLs in `frontend/src/services` if the backend runs on a different host or port.
