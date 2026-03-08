# Use official Python slim image - no nix, no externally-managed env issues
FROM python:3.11-slim

WORKDIR /app

# Install dependencies first (layer caching)
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

EXPOSE 8000

# Use $PORT env var set by Railway (defaults to 8000 locally)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
