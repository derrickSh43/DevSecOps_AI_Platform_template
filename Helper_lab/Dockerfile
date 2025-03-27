# Use slim Python image
FROM python:3.11-slim

# Avoid prompts & install docker client + basic tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl docker.io iputils-ping vim sudo && \
    pip install --no-cache-dir fastapi uvicorn[standard] docker && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend code
COPY backend/main.py /app/main.py
COPY backend/requirements.txt /app/requirements.txt

# Copy frontend static files
COPY frontend/static /app/static

# Copy labs directory
COPY labs /app/labs

# Expose port
EXPOSE 8000

# Start the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]