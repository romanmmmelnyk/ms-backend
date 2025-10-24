# Deployment Guide

## Server Setup (One-time)

### 1. Install Node.js and PM2 on your server
```bash
# Install Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 to start on server reboot
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u YOUR_USERNAME --hp /home/YOUR_USERNAME
```

### 2. Clone your repository on the server
```bash
cd /var/www  # or your preferred location
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ms-backend
cd ms-backend
```

### 3. Create .env file on server
```bash
nano .env
```

Add your production environment variables:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/ms_backend"

# CORS Configuration - Choose one option:
# Option 1: Single origin (legacy)
CORS_ORIGIN=https://yourdomain.com

# Option 2: Multiple origins (comma-separated)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://admin.yourdomain.com

PORT=3000
NODE_ENV=production
```

### 4. Initial deployment
```bash
npm install
npm run build
npm run prisma:generate
npm run prisma:migrate:deploy
pm2 start ecosystem.config.js
pm2 save
```

### 5. Setup Nginx (optional, for reverse proxy)
```bash
sudo nano /etc/nginx/sites-available/ms-backend
```

Add:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/ms-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## GitHub Actions Setup

### Required Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

1. **SERVER_HOST**
   - Your server IP or domain
   - Example: `123.456.789.0` or `server.yourdomain.com`

2. **SERVER_USER**
   - SSH username on your server
   - Example: `ubuntu` or `root` or your username

3. **SERVER_PORT**
   - SSH port (usually 22)
   - Example: `22`

4. **SSH_PRIVATE_KEY**
   - Your SSH private key for authentication
   - Generate on your local machine if you don't have one:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions"
   ```
   - Copy the private key:
   ```bash
   cat ~/.ssh/id_ed25519
   ```
   - Paste the entire content (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`)

5. **APP_PATH**
   - Full path to your application on the server
   - Example: `/var/www/ms-backend`

### Add SSH public key to server

Copy your public key to the server:
```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub YOUR_USER@YOUR_SERVER
```

Or manually add it:
```bash
# On server
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste your public key and save
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

## Workflow Files

Two workflow options are provided:

1. **deploy-simple.yml** (Recommended)
   - Everything runs on the server
   - Simpler, faster
   - Uses less GitHub Actions minutes

2. **deploy.yml** (Alternative)
   - Builds on GitHub Actions
   - Good for running tests before deploy

Choose one and delete the other, or rename to disable:
```bash
# Use simple version
mv .github/workflows/deploy.yml .github/workflows/deploy.yml.backup

# Or use full version
mv .github/workflows/deploy-simple.yml .github/workflows/deploy-simple.yml.backup
```

## Testing the Deployment

1. Make a change and push to main/master branch
2. Check GitHub Actions tab in your repository
3. Watch the deployment progress
4. Verify on your server:
```bash
pm2 status
pm2 logs ms-backend
```

## Useful PM2 Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs ms-backend

# Restart app
pm2 restart ms-backend

# Stop app
pm2 stop ms-backend

# Start app
pm2 start ecosystem.config.js

# Monitor
pm2 monit
```

## Troubleshooting

### Deployment fails at git pull
- Ensure the server can access GitHub (SSH keys configured)
- Or use HTTPS: `git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git`

### PM2 not found
```bash
sudo npm install -g pm2
```

### Database connection issues
- Check DATABASE_URL in .env on server
- Ensure PostgreSQL is running
- Check firewall rules

### Port already in use
```bash
# Check what's using the port
sudo lsof -i :3000

# Kill the process or change PORT in .env
```

## Security Recommendations

1. Use a firewall (UFW):
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. Use environment-specific .env files
3. Never commit .env to Git
4. Use SSL certificate (Let's Encrypt):
```bash
sudo certbot --nginx -d api.yourdomain.com
```

5. Limit SSH access to specific IPs if possible
6. Keep Node.js and dependencies updated
7. Set up automated backups for your database

