# HealthCare Web App

Full-stack health companion featuring BMI calculations, personalized diet and exercise planners, and community feedback tools. The project serves a static frontend built with vanilla HTML/CSS/JS via an Express backend backed by SQLite for persistence.

## Prerequisites

- Node.js 18+
- npm 8+

## Installation

```bash
npm install
```

## Available Scripts

- `npm start` – launches the Express server on port 3000 and serves the frontend from `public/`.
- `npm run dev` – runs the server with Node's `--watch` flag for automatic reloads during development.

## Project Structure

```
HealthCare/
├── public/          # Frontend assets (HTML, CSS, JS)
├── server/          # Express server and API routes
├── database/        # SQLite database file (auto-created)
├── package.json
└── README.md
```

## Features

- **BMI Calculator** – supports metric and imperial inputs, persists latest results locally, and stores calculations server-side.
- **Diet Plans** – generates goal-specific meal recommendations and optionally persists them to the backend.
- **Exercise Programs** – builds weekly schedules with categorized workouts tailored to user goals.
- **Feedback System** – collects user submissions with rating metadata and exposes public entries.
- **SQLite Persistence** – captures BMI logs, diet/exercise plans, and feedback for later retrieval.

## Environment

The server stores data in `database/healthcare.db`. The directory is created automatically at runtime. Update `PORT` via environment variable if you need to run on a different port.

## API Endpoints (Summary)

- `GET /api/health` – health check.
- `POST /api/bmi/calculate`
- `GET /api/bmi/recent`
- `POST /api/diet/generate`
- `POST /api/exercise/generate`
- `POST /api/feedback/submit`
- `GET /api/feedback/public`

Each POST endpoint expects JSON bodies matching the objects produced by the frontend forms.
