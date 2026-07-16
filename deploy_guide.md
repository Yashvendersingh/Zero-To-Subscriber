# 🚀 Deployment Guide — ResumeAI

This guide details how to deploy the **ResumeAI** application for free using **Vercel** (for the React frontend) and **Render** (for the FastAPI backend), connecting to your **Neon PostgreSQL** database.

---

## 💾 Step 1: Database (Neon PostgreSQL)
You already have your Neon database! Make sure to use the **asyncpg** driver configuration for your backend connection.
* **Connection String Format (Render config)**: 
  `postgresql+asyncpg://neondb_owner:password@ep-host.neon.tech/neondb?ssl=require`
  *(We strip parameters like sslmode/channel_binding dynamically in code, so just changing the prefix to `postgresql+asyncpg://` is perfect)*

---

## ⚙️ Step 2: Deploy the Backend (Render.com)
Render provides free web hosting for Python/FastAPI backend services.

1. Create a free account at **[https://dashboard.render.com/](https://dashboard.render.com/)**.
2. Click **New +** and select **Web Service**.
3. Link your GitHub repository (`Zero-To-Subscriber`).
4. Configure the Web Service settings:
   - **Name**: `resume-ai-backend` (or any custom name)
   - **Environment**: `Python 3`
   - **Region**: Select the region closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend` (This enters the `backend/` folder before running scripts)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
5. Open the **Environment** section on Render and add these Environment Variables:
   - `SECRET_KEY`: (A random, long string for JWT signing, e.g. `your-super-secret-key-1234`)
   - `REFRESH_SECRET_KEY`: (Another random string for JWT refresh signing, e.g. `another-super-secret-key-5678`)
   - `DATABASE_URL`: `postgresql+asyncpg://neondb_owner:...@ep-...neon.tech/neondb?ssl=require`
   - `STRIPE_SECRET_KEY`: `sk_test_...` (Your Stripe secret key)
   - `STRIPE_PUBLISHABLE_KEY`: `pk_test_...` (Your Stripe publishable key)
   - `STRIPE_PRICE_PRO`: `price_...` (Your Stripe price ID for Pro)
   - `GEMINI_API_KEY`: `AIzaSy...` (Your Gemini API key from AI Studio)
   - `FRONTEND_URL`: (Wait for Step 3 to get your Vercel URL, then fill this in, e.g. `https://resume-ai-frontend.vercel.app`)
6. Click **Create Web Service**. 
7. Once deployed, copy your Render Web Service URL (e.g. `https://resume-ai-backend.onrender.com`).

---

## 🎨 Step 3: Deploy the Frontend (Vercel)
Vercel is the easiest, fastest platform to deploy React + Vite apps.

1. Go to **[https://vercel.com/](https://vercel.com/)** and sign up with GitHub.
2. Click **Add New** -> **Project**.
3. Import the `Zero-To-Subscriber` repository.
4. Set up project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (Vercel will build from inside the `frontend/` folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Open the **Environment Variables** drop-down and add:
   - **Key**: `VITE_API_URL`
   - **Value**: (Your Render Backend URL, e.g. `https://resume-ai-backend.onrender.com`)
6. Click **Deploy**.
7. Once completed, Vercel will give you a public URL (e.g., `https://zero-to-subscriber-yours.vercel.app`).
8. **Final Link:** Go back to Render, edit your `FRONTEND_URL` environment variable to match your new Vercel URL, and save. (Render will redeploy with this update to allow CORS connection).

---

## 💳 Step 4: Configure Stripe Webhooks (Optional for Hackathon)
To automate upgrading users to Pro when Stripe checkout completes:
1. In Stripe Dashboard, go to **Developers** -> **Webhooks**.
2. Click **Add endpoint**.
3. Set **Endpoint URL** to: `https://YOUR_BACKEND_URL/api/v1/billing/webhook` (e.g. `https://resume-ai-backend.onrender.com/api/v1/billing/webhook`).
4. Select event: `checkout.session.completed`.
5. Click **Add endpoint**.
6. Copy the **Signing secret** (`whsec_...`).
7. Go to Render, add `STRIPE_WEBHOOK_SECRET` = `whsec_...` to your environment variables, and save.
