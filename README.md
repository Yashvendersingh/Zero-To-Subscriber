# ResumeAI — AI Resume Reviewer SaaS

A full-stack, production-ready SaaS product built in a day. Users upload a resume, paste a job description, and get AI-powered evaluation matching scores, keyword checklists, and actionable recommendations.

## 🚀 Key Features
- **Landing Page**: Premium marketing page with hero, features, and pricing cards.
- **Authentication**: JWT-based session management storing cookies in HttpOnly mode for high security.
- **Core Engine**: Gemini AI resume parsing and keyword optimization recommendations.
- **Payments & Billing**: Stripe Checkout integration and Stripe Customer Portal, with a built-in zero-config **Stripe Simulator sandbox** if Stripe keys are left empty.
- **Plan Gating**: Free tier limited to 3 evaluations per month; Pro tier gets unlimited scans.

---

## 🛠️ Project Structure
```
Zero-to-Subscriber/
├── backend/            # FastAPI python backend
│   ├── app/
│   │   ├── api/        # Routers (auth, reviews, billing)
│   │   ├── core/       # Security (JWT, passlib) & configuration
│   │   ├── db/         # SQLAlchemy sessions (Postgres/SQLite)
│   │   ├── models/     # Database entities (User, Review)
│   │   ├── schemas/    # Pydantic data schemas
│   │   └── services/   # AI services (Gemini API & local mock)
│   └── .env            # Backend env configurations
├── frontend/           # React + Tailwind v4 Vite web application
│   ├── src/
│   │   ├── components/ # Shared UI elements (Navbar, circular score gauge)
│   │   ├── context/    # User Auth state providers
│   │   ├── lib/        # API client configured for HttpOnly session cookies
│   │   └── pages/      # Application screens (Mock Checkout, Dashboard)
│   └── .env            # Frontend env configuration
└── README.md           # Documentation
```

---

## 📦 Getting Started

### 1. Backend Setup (FastAPI)
Navigate to the backend directory and set up a Python virtual environment:

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

Verify your environment variables are configured in `backend/.env`. By default, the application will create a local SQLite file (`sql_app.db`) for immediate offline testing.

Start the FastAPI development server:
```bash
uvicorn app.main:app --reload --port 8000
```
The API documentation will be available at: **http://localhost:8000/docs**

---

### 2. Frontend Setup (React + Tailwind v4)
Open a new terminal, navigate to the frontend directory, and launch the dev server:

```bash
cd frontend
npm install
npm run dev
```
Open your browser to: **http://localhost:5173**

---

## ⚙️ Stripe & AI Configuration Modes

To make local testing and review as fast as possible, the application supports **Dual-Mode execution**:

### A. Sandbox Simulator Mode (Default - Zero Configuration)
If you run the app without entering API keys:
- **AI Reviews**: The backend generates realistic matching evaluations containing score variations, keyword checklists, and recommendations.
- **Stripe Checkout**: Clicking "Upgrade to Pro" redirects you to a beautiful replica of Stripe Checkout, allowing you to use a test card. Paying fires a simulated webhook event locally to upgrade your plan instantly!
- **Customer Portal**: You can access a simulated Stripe customer billing page to cancel or manage subscriptions to test rate-limiting features.

### B. Live Integration Mode (Production Keys)
To connect to your live Stripe and Google Gemini services, simply update `backend/.env` with your credentials:

```env
# Google Gemini API
GEMINI_API_KEY=AIzaSy...

# Stripe Credentials
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_PRO=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
*(Once keys are added, the app automatically switches to real Stripe Checkout redirecting and calls Gemini 1.5 Flash for live reviews!)*
