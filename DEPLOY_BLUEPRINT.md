# Auto Deploy Blueprint

This blueprint sets up automatic deployment for the SULA monorepo using GitHub Actions.

## Overview

- **Frontend**: Deploys to Vercel on push to `main`/`master` when `frontend/` changes
- **Backend**: Deploys to Railway on push to `main`/`master` when `backend/` changes

## Setup Instructions

### 1. GitHub Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

#### For Frontend (Vercel):
- `VERCEL_TOKEN`: Your Vercel token (get from Vercel dashboard > Account Settings > Tokens)
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.railway.app`)

#### For Backend (Railway):
- `RAILWAY_TOKEN`: Your Railway token (get from Railway dashboard > Account Settings > Tokens)
- `RAILWAY_PROJECT_ID`: Your Railway project ID

### 2. Vercel Project Setup

1. Create a new project in Vercel
2. Import your GitHub repo
3. Set root directory to `frontend`
4. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend URL

### 3. Railway Project Setup

1. Create a new project in Railway
2. Connect your GitHub repo
3. Set service root to `backend`
4. Configure environment variables in Railway:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (or your preferred key)
   - `JWT_SECRET`
   - `PORT`: `3000` (Railway default)

### 4. Alternative Backend Deployments

If you prefer other services, modify `.github/workflows/deploy-backend.yml`:

#### Render:
```yaml
- name: Deploy to Render
  run: |
    curl -X POST https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}
```

#### Fly.io:
```yaml
- name: Deploy to Fly.io
  uses: superfly/flyctl-actions/setup-flyctl@master
  with:
    flyctl-version: latest
- run: flyctl deploy --remote-only
  env:
    FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

## Workflow Triggers

- Frontend deploys automatically when you push changes to `frontend/` directory
- Backend deploys automatically when you push changes to `backend/` directory
- Both deploy on pushes to `main` or `master` branches

## Manual Deployment

You can also deploy manually:

```bash
# Frontend
cd frontend
npm run build
# Then upload dist/ to your hosting

# Backend
cd backend
npm run build  # if needed
# Deploy to your chosen service
```

## Environment Variables

Make sure to set these in your deployment platforms:

### Frontend (Vercel):
- `VITE_API_URL`: Backend API URL

### Backend (Railway/Render/etc.):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_ANON_KEY` if preferred)
- `JWT_SECRET`
- `PORT`: Usually 3000 or 5000

## Troubleshooting

1. **Build fails**: Check Node.js version (set to 18 in workflows)
2. **Secrets not found**: Ensure secrets are added to GitHub repo
3. **Vercel deployment fails**: Check project settings and environment variables
4. **Railway deployment fails**: Ensure Railway CLI is properly authenticated

## Security Notes

- Never commit sensitive keys to code
- Use GitHub secrets for all API tokens
- Rotate tokens regularly
- Use least-privilege access