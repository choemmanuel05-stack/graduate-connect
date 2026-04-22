# GraduateConnect

A full-stack web platform connecting university graduates with job opportunities from companies and industries.

## Tech Stack

- **Backend**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL (SQLite for local dev)
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Auth**: JWT (djangorestframework-simplejwt)

## Quick Start

### Option 1: Docker (Recommended)
```bash
docker-compose up
```
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

### Option 2: Manual

**Backend:**
```bash
cp .env.example .env          # Configure your environment
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd linkedin-react-frontend
npm install
npm run dev
```

## User Roles

| Role | Capabilities |
|------|-------------|
| Graduate | Create profile, upload CV, browse & apply for jobs |
| Employer | Post jobs, browse graduates, manage applications |
| Administrator | Manage all users, jobs, and platform content |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login (returns JWT) |
| POST | `/api/auth/refresh/` | Refresh JWT token |
| GET | `/api/auth/me/` | Get current user |
| GET/PUT | `/api/graduates/profile/` | Graduate profile |
| GET | `/api/graduates/` | List graduates |
| GET/POST | `/api/jobs/` | List/create jobs |
| POST | `/api/jobs/:id/apply/` | Apply to job |
| GET | `/api/employers/jobs/` | Employer's jobs |
| GET | `/api/admin/users/` | Admin: list users |

## Security Features

- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Rate limiting on auth endpoints (5 attempts / 5 min)
- XSS protection headers
- CSRF protection
- Input validation on frontend and backend
- Password hashing (Django built-in)

## Environment Variables

See `.env.example` for all required variables.

## Deployment

The app includes:
- `Dockerfile` for containerization
- `docker-compose.yml` for local orchestration
- `.github/workflows/ci.yml` for CI/CD via GitHub Actions
- `gunicorn` for production WSGI server
- `whitenoise` for static file serving
