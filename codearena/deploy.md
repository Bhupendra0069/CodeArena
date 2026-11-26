# 🚀 CodeArena — AWS Deployment Guide (GitHub CI/CD Pipeline)

> **Project:** CodeArena — Full-Stack MERN (React + Vite + Express + MongoDB + Socket.IO)  
> **Stack:** Frontend → AWS Amplify | Backend → AWS EC2 | Database → MongoDB Atlas

---

## 📐 Architecture Overview

```
GitHub Repo
     │
     ├── Push to main branch
     │
     ├──► AWS Amplify (Auto-deploy Frontend)
     │         React + Vite Build → CDN
     │
     └──► GitHub Actions (CI/CD for Backend)
               │
               └──► AWS EC2 (Node.js Backend)
                         Express + Socket.IO
                         Connected to MongoDB Atlas
```

---

## ✅ Prerequisites Checklist

- [ ] AWS Account (free tier works) → https://aws.amazon.com
- [ ] GitHub Account with your project pushed to a repo
- [ ] MongoDB Atlas Account (free) → https://cloud.mongodb.com
- [ ] Judge0 RapidAPI Key → https://rapidapi.com/judge0-official/api/judge0-ce

---

## PHASE 1 — Prepare Your GitHub Repository

### Step 1: Push Project to GitHub

Open terminal/cmd in your project root (`codearena/`):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Bhupendra0069/codearena.git
git push -u origin main
```

> ⚠️ Make sure `.gitignore` includes `node_modules/`, `.env`, `client/dist/`

---

## PHASE 2 — Setup MongoDB Atlas (Cloud Database)

### Step 2: Create MongoDB Atlas Cluster

1. Go to → https://cloud.mongodb.com
2. Click **"Try Free"** → Sign up / Log in
3. Click **"Create"** → Choose **FREE (M0 Sandbox)** tier
4. Select **AWS** as provider → Choose region closest to you (e.g., `ap-south-1` for India)
5. Name your cluster: `codearena-cluster`
6. Click **"Create Deployment"**

### Step 3: Create Database User

1. In left sidebar → **"Database Access"**
2. Click **"Add New Database User"**
3. Authentication: **Password**
   - Username: `codearena_user`
   - Password: (generate a strong password, **save it!**)
4. Role: **Atlas admin**
5. Click **"Add User"**

### Step 4: Whitelist All IPs (for EC2 access)

1. Left sidebar → **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** → This adds `0.0.0.0/0`
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Left sidebar → **"Database"** → Click **"Connect"** on your cluster
2. Choose **"Drivers"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string — it looks like:
   ```
   mongodb+srv://codearena_user:<password>@codearena-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=codearena-cluster
   ```
5. Replace `<password>` with your actual password
6. Add database name before `?`:
   ```
   mongodb+srv://codearena_user:YOURPASSWORD@codearena-cluster.xxxxx.mongodb.net/codearena?retryWrites=true&w=majority
   ```
7. **Save this string** — you'll need it in Step 11

---

## PHASE 3 — Deploy Backend on AWS EC2

### Step 6: Launch an EC2 Instance

1. Go to → https://console.aws.amazon.com
2. Search **"EC2"** in the top search bar → Click EC2
3. Click **"Launch Instance"** (orange button)
4. Configure:
   - **Name:** `codearena-backend`
   - **AMI:** `Ubuntu Server 22.04 LTS` (Free tier eligible ✅)
   - **Instance type:** `t2.micro` (Free tier eligible ✅)
   - **Key pair:** Click **"Create new key pair"**
     - Name: `codearena-key`
     - Type: RSA
     - Format: `.pem`
     - Click **"Create key pair"** → `.pem` file downloads automatically → **Keep it safe!**
5. **Network settings:** Click **"Edit"**
   - Allow SSH (port 22) — Source: My IP
   - Click **"Add security group rule"**:
     - Type: Custom TCP | Port: `5000` | Source: `0.0.0.0/0`
   - Click **"Add security group rule"**:
     - Type: HTTP | Port: `80` | Source: `0.0.0.0/0`
6. Click **"Launch Instance"**

### Step 7: Connect to EC2 via SSH

> On Windows, use **Git Bash** or **Windows Terminal (PowerShell)**

```bash
# Navigate to where your .pem file was downloaded
cd Downloads

# Fix permissions (Git Bash on Windows)
chmod 400 codearena-key.pem

# SSH into instance (replace with YOUR EC2 Public IP)
ssh -i "codearena-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP
```

> Find your EC2 Public IP: EC2 Dashboard → Instances → Click your instance → Copy **"Public IPv4 address"**

### Step 8: Install Node.js & Dependencies on EC2

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version   # Should show v20.x.x
npm --version

# Install PM2 (process manager — keeps Node.js running forever)
sudo npm install -g pm2

# Install Git
sudo apt install git -y
```

### Step 9: Clone Your Repo on EC2

```bash
# Clone your GitHub repository
git clone https://github.com/YOUR_USERNAME/codearena.git

# Navigate to server folder
cd codearena/server

# Install backend dependencies
npm install
```

### Step 10: Setup Nginx as Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config for CodeArena backend
sudo nano /etc/nginx/sites-available/codearena
```

Paste the following (press `Ctrl+Shift+V` to paste in terminal):

```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save and exit: `Ctrl+X` → `Y` → `Enter`

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/codearena /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Step 11: Create .env File on EC2

```bash
# Inside codearena/server/ on EC2
nano .env
```

Paste your environment variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://codearena_user:YOURPASSWORD@codearena-cluster.xxxxx.mongodb.net/codearena?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min32chars
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_judge0_rapidapi_key_here
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
CLIENT_URL=https://YOUR_AMPLIFY_APP_URL.amplifyapp.com
NODE_ENV=production
```

> ⚠️ You'll update `CLIENT_URL` after deploying frontend in Phase 4

Save: `Ctrl+X` → `Y` → `Enter`

### Step 12: Start Backend with PM2

```bash
# Start the server
pm2 start src/server.js --name "codearena-backend"

# Save PM2 config (auto-restart on reboot)
pm2 save
pm2 startup
# Run the command it outputs (copy-paste it)

# Check status
pm2 status
pm2 logs codearena-backend
```

✅ **Your backend is now live at:** `http://YOUR_EC2_PUBLIC_IP`

---

## PHASE 4 — Deploy Frontend on AWS Amplify

### Step 13: Create amplify.yml in Project Root

Create `codearena/amplify.yml`:

```yaml
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - cd client
            - npm install
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: client/dist
        files:
          - '**/*'
      cache:
        paths:
          - client/node_modules/**/*
    appRoot: .
```

Commit and push this file:

```bash
git add amplify.yml
git commit -m "Add Amplify build config"
git push origin main
```

### Step 14: Deploy Frontend via AWS Amplify

1. Go to → https://console.aws.amazon.com → Search **"Amplify"** → Open it
2. Click **"Create new app"**
3. Source: **GitHub** → Click **"Authorize AWS Amplify"**
4. Select your repository: **codearena**
5. Branch: **main**
6. Click **"Next"**
7. Amplify detects `amplify.yml` automatically → Click **"Next"**

### Step 15: Set Environment Variables in Amplify

On the **"Configure build settings"** page → Click **"Advanced settings"** → **Environment variables**:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `http://YOUR_EC2_PUBLIC_IP` |
| `VITE_SOCKET_URL` | `http://YOUR_EC2_PUBLIC_IP` |

Click **"Save and deploy"**

### Step 16: Wait for Amplify Build

- Build takes ~3-5 minutes
- Watch the build logs in Amplify Console
- Once done, you'll get a URL like: `https://main.xxxxxxxx.amplifyapp.com`

✅ **Your frontend is live!**

### Step 17: Update Backend CLIENT_URL

SSH back into EC2:

```bash
ssh -i "codearena-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP
nano ~/codearena/server/.env
```

Update `CLIENT_URL`:
```env
CLIENT_URL=https://main.xxxxxxxx.amplifyapp.com
```

Restart backend:
```bash
pm2 restart codearena-backend
```

---

## PHASE 5 — Setup GitHub Actions CI/CD Pipeline

This auto-deploys backend to EC2 every time you push to `main`.

### Step 18: Add GitHub Secrets

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"** for each:

| Secret Name | Value |
|---|---|
| `EC2_HOST` | Your EC2 Public IP address |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | Contents of your `codearena-key.pem` file |

> To get `.pem` contents: Open the file in Notepad, copy ALL text including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`

### Step 19: Create GitHub Actions Workflow

In your local project, create the folders and file:

**`codearena/.github/workflows/deploy.yml`**

```yaml
name: Deploy CodeArena Backend to EC2

on:
  push:
    branches:
      - main
    paths:
      - 'server/**'

jobs:
  deploy:
    name: Deploy to AWS EC2
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to EC2 via SSH
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/codearena
            git pull origin main
            cd server
            npm install --production
            pm2 restart codearena-backend
            pm2 save
            echo "✅ Backend deployed successfully!"
```

### Step 20: Commit and Push Workflow

```bash
git add .github/
git commit -m "Add GitHub Actions CI/CD pipeline"
git push origin main
```

Go to GitHub → **Actions** tab → Watch your deployment run! 🎉

---

## PHASE 6 — Seed Database

### Step 21: Run Seed Script on EC2

```bash
# SSH into EC2
ssh -i "codearena-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP

cd ~/codearena/server
npm run seed
```

This populates your MongoDB with sample coding problems for the demo.

---

## 🧪 Testing Your Deployment

| Test | URL |
|---|---|
| Frontend App | `https://main.xxxxxxxx.amplifyapp.com` |
| Backend Root | `http://YOUR_EC2_PUBLIC_IP` |
| API Test | `http://YOUR_EC2_PUBLIC_IP/api/problems` |

---

## 🔧 Useful Commands on EC2

```bash
# Check backend status
pm2 status

# Check backend logs
pm2 logs codearena-backend

# Restart backend
pm2 restart codearena-backend

# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Pull latest code manually
cd ~/codearena && git pull origin main
```

---

## 🚨 Common Issues & Fixes

| Issue | Fix |
|---|---|
| `CORS error` on frontend | Add Amplify URL to `CLIENT_URL` in EC2 `.env`, restart PM2 |
| Socket.IO not connecting | Make sure port 5000 is open in EC2 Security Group |
| MongoDB connection failed | Check Atlas whitelist has `0.0.0.0/0`, verify connection string |
| Amplify build failed | Check `amplify.yml` paths — `baseDirectory: client/dist` |
| PM2 not restarting on reboot | Run `pm2 startup` and execute the command it gives |
| SSH permission denied | Run `chmod 400 codearena-key.pem` before SSHing |

---

## 📋 Final Deployment Checklist

- [ ] Code pushed to GitHub `main` branch
- [ ] MongoDB Atlas cluster created with connection string
- [ ] EC2 instance running Ubuntu 22.04 (t2.micro, free tier)
- [ ] Node.js 20 + PM2 + Nginx installed on EC2
- [ ] `.env` file configured on EC2 with all keys
- [ ] Backend running via PM2 (`pm2 status` shows `online`)
- [ ] Nginx reverse proxy configured and running on port 80
- [ ] `amplify.yml` committed to repo root
- [ ] Frontend deployed on AWS Amplify
- [ ] Environment variables (`VITE_API_URL`, `VITE_SOCKET_URL`) set in Amplify
- [ ] `CLIENT_URL` in EC2 `.env` updated to Amplify URL
- [ ] GitHub Secrets (EC2_HOST, EC2_USER, EC2_SSH_KEY) configured
- [ ] GitHub Actions workflow file committed and pushed
- [ ] Database seeded with sample problems (`npm run seed`)

---

## 🔗 Important Service URLs

| Service | URL |
|---|---|
| AWS Console | https://console.aws.amazon.com |
| AWS Amplify | https://console.aws.amazon.com/amplify |
| EC2 Dashboard | https://console.aws.amazon.com/ec2 |
| MongoDB Atlas | https://cloud.mongodb.com |
| Judge0 RapidAPI | https://rapidapi.com/judge0-official/api/judge0-ce |
| GitHub Actions | `https://github.com/YOUR_USERNAME/codearena/actions` |

---

> 💡 **Viva Tip:** Be ready to explain the architecture:
> - **Frontend** is on **AWS Amplify** — CDN-based hosting, auto-builds from GitHub
> - **Backend** is on **AWS EC2** — Node.js with PM2 (process manager) and Nginx (reverse proxy)
> - **Database** is **MongoDB Atlas** — cloud-managed MongoDB
> - **CI/CD** is **GitHub Actions** — auto-deploys backend on every push to `main`
> - **Real-time** battles work via **Socket.IO** connecting frontend to backend
