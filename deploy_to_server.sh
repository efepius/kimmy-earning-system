#!/bin/bash

echo "======================================"
echo "  KIMMY SYSTEM - SERVER DEPLOYMENT"
echo "======================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create .env file for sensitive data
echo "Creating environment configuration..."
cat > .env << EOF
# Higgsfield Configuration
HIGGSFIELD_API_KEY=your_higgsfield_api_key_here

# Platform Credentials
MTURK_ACCESS_KEY=your_mturk_access_key
MTURK_SECRET_KEY=your_mturk_secret_key

# Database
POSTGRES_PASSWORD=secure_password_$(openssl rand -base64 12)

# Redis
REDIS_PASSWORD=redis_password_$(openssl rand -base64 12)
EOF

echo "Environment file created. Please edit .env to add your API keys."
echo ""

# Build and start services
echo "Building Docker containers..."
docker-compose build

echo "Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "Waiting for services to be ready..."
sleep 10

# Check service status
echo ""
echo "Checking service health..."
docker-compose ps

# Display access information
echo ""
echo "======================================"
echo "  DEPLOYMENT COMPLETE!"
echo "======================================"
echo ""
echo "Dashboard URL: http://$(curl -s ifconfig.me)"
echo "API Status: http://$(curl -s ifconfig.me)/api/status"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
echo "To restart: docker-compose restart"
echo ""
echo "The system is now running 24/7 on your server!"