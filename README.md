# Opportunity Map

A full-stack web application to help entrepreneurs discover where to start new businesses by identifying demand-supply gaps.

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.10+

### 1. Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to view the dashboard.

## Tech Stack

- **Backend**: Python (FastAPI) + SQLite
- **Frontend**: React (Vite) + Tailwind CSS v4 + Leaflet.js
- **Visualization**: Recharts + Lucide Icons
