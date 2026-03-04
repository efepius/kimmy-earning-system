FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/
COPY config/ ./config/
COPY data/ ./data/
COPY logs/ ./logs/

# Create necessary directories
RUN mkdir -p /app/data /app/logs /app/config

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=src/dashboard.py
ENV PORT=8080

# Expose ports
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/status || exit 1

# Start all services using supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN pip install supervisor

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]