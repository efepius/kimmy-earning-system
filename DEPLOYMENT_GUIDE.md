# 🚀 Kimmy System - 24/7 Server Deployment Guide

## Quick Deploy Options

### Option 1: DigitalOcean (Recommended - $6/month)
```bash
# 1. Create a Droplet ($6/month - 1GB RAM, 25GB SSD)
# 2. SSH into your droplet
ssh root@your_server_ip

# 3. Clone the repository
git clone https://github.com/yourusername/kimmy-earning-system.git
cd kimmy-earning-system

# 4. Run deployment script
chmod +x deploy_to_server.sh
./deploy_to_server.sh

# 5. Edit .env with your API keys
nano .env
```

### Option 2: AWS EC2 (Free Tier Available)
```bash
# 1. Launch EC2 instance (t2.micro for free tier)
# 2. Connect via SSH
ssh -i your-key.pem ubuntu@ec2-instance-ip

# 3. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 4. Clone and deploy
git clone https://github.com/yourusername/kimmy-earning-system.git
cd kimmy-earning-system
docker-compose up -d
```

### Option 3: Google Cloud (Free $300 Credit)
```bash
# 1. Create VM instance
gcloud compute instances create kimmy-system \
  --machine-type=e2-micro \
  --zone=us-central1-a

# 2. SSH into instance
gcloud compute ssh kimmy-system

# 3. Deploy system
curl -fsSL https://get.docker.com | sh
git clone https://github.com/yourusername/kimmy-earning-system.git
cd kimmy-earning-system
docker-compose up -d
```

### Option 4: Railway.app (Easy Deploy - $5/month)
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and initialize
railway login
railway init

# 3. Deploy
railway up

# 4. Add environment variables in Railway dashboard
```

### Option 5: Render.com (Free Tier Available)
1. Connect GitHub repository
2. Create new Web Service
3. Set build command: `docker build -t kimmy .`
4. Set start command: `docker run -p 80:8080 kimmy`
5. Add environment variables in dashboard

## 🔧 Configuration

### Required Environment Variables
```env
# API Keys (REQUIRED)
HIGGSFIELD_API_KEY=your_higgsfield_key
OPENAI_API_KEY=your_openai_key

# Platform Credentials (Optional but recommended)
MTURK_ACCESS_KEY=your_mturk_access
MTURK_SECRET_KEY=your_mturk_secret
CLICKWORKER_API_KEY=your_clickworker_key

# Database (Auto-generated if not set)
POSTGRES_PASSWORD=secure_password_here
REDIS_PASSWORD=redis_password_here
```

### SSL/HTTPS Setup (Recommended)
```bash
# Using Certbot for free SSL
sudo apt-get update
sudo apt-get install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

### Domain Setup
1. Point your domain to server IP
2. Update nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f kimmy-system

# Last 100 lines
docker-compose logs --tail=100
```

### Check Status
```bash
# Service status
docker-compose ps

# System resources
docker stats

# Health check
curl http://localhost:8080/api/status
```

### Backup Data
```bash
# Backup database
docker exec kimmy-db pg_dump -U kimmy_user kimmy > backup.sql

# Backup all data
tar -czf kimmy-backup.tar.gz data/ logs/ config/
```

## 🔒 Security

### Firewall Rules
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw enable
```

### Auto-restart on Failure
```bash
# Already configured in docker-compose.yml with restart: always
# For system-level restart:
sudo systemctl enable docker
```

### Resource Limits
Add to docker-compose.yml:
```yaml
services:
  kimmy-system:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

## 🚨 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs kimmy-system

# Rebuild container
docker-compose build --no-cache
docker-compose up -d
```

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :8080

# Kill process
sudo kill -9 <PID>
```

### Database Connection Issues
```bash
# Restart database
docker-compose restart postgres

# Check connection
docker exec -it kimmy-db psql -U kimmy_user -d kimmy
```

## 📈 Scaling

### Horizontal Scaling (Multiple Servers)
```yaml
# docker-compose.yml
services:
  kimmy-system:
    deploy:
      replicas: 3
```

### Load Balancing
Use nginx or HAProxy to distribute traffic:
```nginx
upstream kimmy_backend {
    server server1.example.com:8080;
    server server2.example.com:8080;
    server server3.example.com:8080;
}
```

## 🎯 Quick Commands

```bash
# Start system
docker-compose up -d

# Stop system
docker-compose down

# Restart system
docker-compose restart

# Update system
git pull
docker-compose build
docker-compose up -d

# View dashboard
open http://your-server-ip

# Check earnings
curl http://your-server-ip/api/status | jq .summary.total_earnings
```

## 💡 Tips

1. **Use a VPS with at least 1GB RAM** for optimal performance
2. **Enable swap space** if using a small server
3. **Set up daily backups** using cron
4. **Monitor server resources** to prevent overload
5. **Use a CDN** like Cloudflare for better performance

## 🆘 Support

- Dashboard: http://your-server-ip
- API Status: http://your-server-ip/api/status
- Logs: `docker-compose logs -f`

The system will now run 24/7, automatically generating content and earning money!