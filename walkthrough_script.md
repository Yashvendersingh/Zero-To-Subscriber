# 🎥 ResumeAI — Video Walkthrough Script

Here is a 3-minute video walkthrough script for your hackathon submission. It is structured to showcase all core components: the landing page, dynamic resume matching (file upload + AI extraction), Stripe subscription gating, and user account management.

---

## 🎬 Part 1: Introduction (0:00 - 0:30)
* **Visual**: Show your face on camera, then transition to screen share of the landing page at `http://localhost:5173`. Scroll down the page smoothly.
* **Audio / Voiceover**:
  > *"Hey everyone! Today, I’m excited to show you **ResumeAI**—a full-stack, AI-powered Resume Reviewer SaaS built from scratch in under 24 hours. The goal of this project is simple: help job seekers tailor their resumes to match job descriptions perfectly and beat the Applicant Tracking Systems (ATS). Our app is built on a modern stack: **React & Tailwind** on the frontend, **FastAPI** on the backend, **Neon PostgreSQL** for our database, **Stripe** for billing, and **Google Gemini 2.0 Flash** powering the AI analysis."*

---

## 🎨 Part 2: Landing Page & Onboarding (0:30 - 1:00)
* **Visual**: Scroll through the Landing Page sections (Hero, Key Features, Pricing Table). Click the "Start Matching Free" button, which redirects to the Login Page, then click "create a new account" to show the Signup Page. Fill out credentials and sign up.
* **Audio / Voiceover**:
  > *"Here is our landing page, showcasing a premium, responsive glassmorphic UI. Job seekers can see our value proposition, features, and pricing tiers—ranging from a generous Free Starter plan to our Unlimited Pro plan. Signing up is simple and secure. The application uses HttpOnly cookie-based JWT authentication, protecting user sessions and refresh tokens securely."*

---

## 🧠 Part 3: Core AI Resume Reviewer (1:00 - 2:00)
* **Visual**: 
  1. Show the user landing on the Dashboard. Point to the "Usage this Month" card showing "0 / 20 reviews used".
  2. Click "New Evaluation".
  3. Toggle the input mode between "Upload File" and "Paste Text" to show both options.
  4. Drag and drop or select a resume PDF/DOCX file.
  5. Paste a job description (e.g. for a Python Developer role).
  6. Click "Start Evaluation". Show the spinner.
  7. Show the report page: Point to the circular ATS Match Score gauge (e.g., 76%), and scroll through:
     - Section Scores: *Technical Skills Match, Work Experience Relevance, Layout & Formatting, and Education Match*.
     - Interactive Skills Deep-Dive: Point to the green tags (Matched Skills) and the red boxes (Missing Skills) showing specific AI-generated suggestions for each missing skill.
     - Experience & Education cards showing side-by-side required vs. candidate qualification checks with status badges (*Match*, *Partial*, or *Gap*).
* **Audio / Voiceover**:
  > *"Once logged in, we land on our dashboard tracking our monthly usage. Let's create a new evaluation. ResumeAI lets you toggle between copy-pasting your text or uploading your resume file directly as a PDF, Word document, or TXT file. Let's upload a resume and paste in our target job description."*
  >
  > *(Wait for spinner to finish)*
  >
  > *"Our live Gemini API scan completes in seconds! We get a full ATS Match Report. Under the hood, Gemini extracts and evaluates: section scores, a structured skills deep-dive listing exactly which skills were matched and which ones are missing—along with specific learning suggestions—and a side-by-side validation of professional experience and education credentials. It even filters out course durations so it never confuses a '3-year degree' with actual years of work experience!"*

---

## 💳 Part 4: Stripe Integration & Subscription Gating (2:00 - 2:45)
* **Visual**: 
  1. Navigate back to the Dashboard. Point out that the usage counter has incremented to "1 / 20 reviews used".
  2. Click the "Upgrade" link or navigate to the "Billing" page.
  3. Click "Get Unlimited Access" under the Pro tier.
  4. Show the Stripe Checkout page. Enter `4242 4242 4242 4242` for the test card, complete the checkout, and show the redirection back to the success page.
  5. Show the updated Dashboard where the plan badge now says **Pro Plan** and usage is set to **Unlimited**.
* **Audio / Voiceover**:
  > *"Users on the Free plan are limited to 20 reviews. Once they hit their limit, or if they want priority matching, they can upgrade. Clicking 'Upgrade to Pro' redirects them directly to a secure Stripe Checkout session. Using a Stripe test card, we can subscribe to the Pro subscription. Upon successful payment, we're redirected back. Our dashboard immediately reflects our new Pro Plan status with unlimited evaluations unlocked!"*

---

## 🔐 Part 5: User Management & Outro (2:45 - 3:00)
* **Visual**: Show the "Forgot Password" flow by logging out, clicking "Forgot Password" on the login page, entering an email, showing the generated link, and setting a new password. Bring the camera back to your face.
* **Audio / Voiceover**:
  > *"We've also added security features like a password reset flow. That completes our walkthrough of ResumeAI! We successfully went from an empty repository to a fully secure, end-to-end SaaS application in a single day. Thank you for watching, and the GitHub repository is linked below. Feel free to check out the codebase!"*
