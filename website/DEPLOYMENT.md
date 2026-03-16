# 🦅 MalikClaw Website - Deployment Guide

This guide covers deploying the MalikClaw website to various platforms.

---

## 📋 Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Git repository access

---

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy your Next.js website with automatic CI/CD.

#### Steps:

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via CLI**:
   ```bash
   cd website
   vercel
   ```

3. **Or deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `website`
   - Click "Deploy"

#### Configuration:

- **Root Directory**: `website`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### Environment Variables:
No environment variables required for static deployment.

---

### Option 2: Netlify

Another excellent option with automatic deployments.

#### Steps:

1. **Install Netlify CLI** (optional):
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy via CLI**:
   ```bash
   cd website
   netlify deploy --prod
   ```

3. **Or deploy via Netlify Dashboard**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Set base directory to `website`
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Deploy site"

#### netlify.toml Configuration:

Create `website/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

### Option 3: Self-Hosted (Node.js Server)

Run the website on your own server with Node.js.

#### Steps:

1. **Build the website**:
   ```bash
   cd website
   npm install
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm run start
   ```

   By default, it runs on `http://localhost:3000`

3. **Run as a service** (Linux systemd):

   Create `/etc/systemd/system/malikclaw-website.service`:

   ```ini
   [Unit]
   Description=MalikClaw Website
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/var/www/malikclaw/website
   ExecStart=/usr/bin/npm run start
   Restart=always
   Environment=NODE_ENV=production
   Environment=PORT=3000

   [Install]
   WantedBy=multi-user.target
   ```

   Enable and start:
   ```bash
   sudo systemctl enable malikclaw-website
   sudo systemctl start malikclaw-website
   sudo systemctl status malikclaw-website
   ```

4. **Set up reverse proxy** (Nginx):

   Create `/etc/nginx/sites-available/malikclaw-website`:

   ```nginx
   server {
       listen 80;
       server_name malikclaw.io www.malikclaw.io;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   Enable and reload:
   ```bash
   sudo ln -s /etc/nginx/sites-available/malikclaw-website /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

### Option 4: Docker Deployment

Containerized deployment for any platform.

#### Dockerfile:

Create `website/Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### Build and Run:

```bash
cd website
docker build -t malikclaw-website .
docker run -d -p 3000:3000 --name malikclaw-website malikclaw-website
```

#### Docker Compose:

Create `website/docker-compose.yml`:

```yaml
version: '3.8'

services:
  malikclaw-website:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
    networks:
      - malikclaw-network

networks:
  malikclaw-network:
    driver: bridge
```

Run:
```bash
docker compose up -d
```

---

### Option 5: GitHub Pages (Static Export)

For a purely static site without server-side rendering.

#### Steps:

1. **Update `next.config.ts`**:
   ```typescript
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   };

   export default nextConfig;
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages**:
   
   Use `gh-pages` package:
   ```bash
   npm install -D gh-pages
   ```

   Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d out"
   }
   ```

   Deploy:
   ```bash
   npm run deploy
   ```

---

## 🔒 SSL/HTTPS Configuration

### With Let's Encrypt (Self-Hosted):

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d malikclaw.io -d www.malikclaw.io

# Auto-renewal is set up automatically
```

---

## 📊 Performance Optimization

### Enable Compression (Nginx):

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
```

### CDN Integration:

For global performance, use a CDN:

- **Vercel/Netlify**: Built-in CDN
- **Cloudflare**: Free tier available
- **AWS CloudFront**: For AWS deployments

---

## 🔄 CI/CD Setup

### GitHub Actions:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Website

on:
  push:
    branches: [main]
    paths:
      - 'website/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: website/package-lock.json
      
      - name: Install dependencies
        working-directory: ./website
        run: npm ci
      
      - name: Build
        working-directory: ./website
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./website
```

---

## 📝 Post-Deployment Checklist

- [ ] Custom domain configured
- [ ] SSL certificate installed
- [ ] DNS records updated
- [ ] Analytics tracking added (if needed)
- [ ] Social media meta tags verified
- [ ] Sitemap submitted to search engines
- [ ] Robots.txt configured
- [ ] Error pages customized (404, 500)
- [ ] Performance testing completed
- [ ] Mobile responsiveness verified

---

## 🐛 Troubleshooting

### Build Fails:

```bash
# Clear cache and rebuild
rm -rf node_modules .next package-lock.json
npm install
npm run build
```

### Port Already in Use:

```bash
# Change port
PORT=3001 npm run start
```

### Memory Issues:

```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## 📞 Support

For issues or questions:
- GitHub Issues: [AbdullahMalik17/malikclaw/issues](https://github.com/AbdullahMalik17/malikclaw/issues)
- Twitter: [@Ab4695Athar](https://x.com/Ab4695Athar)

---

**Released by MalikClaw Team** 🦅
