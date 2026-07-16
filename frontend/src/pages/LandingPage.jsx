import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Check, Cpu, Zap, Star, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LandingPage() {
  const { user } = useAuth();

  const pricingFeatures = {
    free: [
      "20 resume evaluations per month",
      "Basic ATS keyword check",
      "General scoring indicator",
      "Standard processing queue",
    ],
    pro: [
      "Unlimited evaluations",
      "Deep AI keyword checklist",
      "Detailed sectional matching score",
      "Custom, copyable improvement steps",
      "Priority processing queue",
      "PDF formatting & styling tips",
    ]
  };

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-28 md:pt-32">
          {/* Background Glows */}
          <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-600/20 blur-[100px] animate-pulse-slow"></div>
          <div className="absolute top-10 right-10 -z-10 h-64 w-64 rounded-full bg-accent-500/10 blur-[80px]"></div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 text-sm font-semibold text-brand-400 mb-8 animate-float">
              <Sparkles className="h-4 w-4" />
              <span>Free ATS Scorer Included</span>
            </div>
            
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-none">
              Land More Interviews with <span className="text-gradient font-black">AI Resume Reviews</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
              Instantly analyze your resume against any job description. Get automated ATS keyword matches, sectional scoring, and direct suggestions to tailor your profile in seconds.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="group flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-brand-500 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]"
              >
                <span>Optimize Your Resume Now</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#pricing"
                className="rounded-lg border border-white/10 px-6 py-3.5 text-base font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                View Plans
              </a>
            </div>

            {/* Simulated Dashboard Mockup */}
            <div className="mt-16 mx-auto max-w-5xl rounded-xl border border-white/10 bg-dark-800/80 p-4 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="text-xs text-gray-500 font-mono">dashboard.resumeai.co</div>
                <div className="w-4"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="md:col-span-2 rounded-lg bg-dark-900 p-6 border border-white/5">
                  <h3 className="font-bold text-lg text-white mb-2">Resume Score Analysis</h3>
                  <p className="text-sm text-gray-400">Senior Full-Stack Engineer role match</p>
                  <div className="mt-6 flex flex-col gap-3">
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Skills Match</span><span className="text-brand-400 font-bold">85%</span></div>
                    <div className="w-full bg-dark-800 h-2 rounded-full"><div className="bg-brand-500 h-2 rounded-full" style={{width: '85%'}}></div></div>
                    <div className="flex justify-between text-sm mt-2"><span className="text-gray-400">Experience Match</span><span className="text-accent-500 font-bold">78%</span></div>
                    <div className="w-full bg-dark-800 h-2 rounded-full"><div className="bg-accent-500 h-2 rounded-full" style={{width: '78%'}}></div></div>
                  </div>
                </div>
                <div className="rounded-lg bg-dark-900 p-6 border border-white/5 flex flex-col items-center justify-center text-center">
                  <div className="relative w-28 h-28 flex items-center justify-center border-4 border-emerald-500/20 rounded-full">
                    <div className="text-3xl font-black text-emerald-400">82</div>
                    <div className="absolute bottom-1 text-[8px] uppercase tracking-wider text-gray-500">Overall ATS</div>
                  </div>
                  <span className="mt-4 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Strong Match</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 border-t border-white/5 bg-dark-800/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Everything You Need to Beat the ATS</h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-400">We analyze your resume using advanced LLMs to identify specific improvements.</p>
            </div>
            
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="glass-panel p-8 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-brand-500/10 flex items-center justify-center mb-6 border border-brand-500/20">
                  <Zap className="h-6 w-6 text-brand-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Instant Evaluation</h3>
                <p className="text-gray-400 text-sm">Upload your resume and get detailed feedback in under 10 seconds. No waiting queues or human delays.</p>
              </div>

              <div className="glass-panel p-8 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-accent-500/10 flex items-center justify-center mb-6 border border-accent-500/20">
                  <Cpu className="h-6 w-6 text-accent-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Smart Keyword Scanning</h3>
                <p className="text-gray-400 text-sm">We crawl the job description to find missing tech stack words and soft skills that recruiters filter for.</p>
              </div>

              <div className="glass-panel p-8 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                  <Star className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Actionable Suggestions</h3>
                <p className="text-gray-400 text-sm">Get explicit recommendations on what sections to rephrase, formatting errors to correct, and outcomes to quantify.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 relative overflow-hidden">
          <div className="absolute bottom-0 left-1/4 -z-10 h-80 w-80 rounded-full bg-accent-500/10 blur-[100px]"></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Transparent, Value-Focused Pricing</h2>
              <p className="mx-auto mt-4 max-w-xl text-gray-400">Unlock your interview potential today. No hidden costs.</p>
            </div>

            <div className="mx-auto mt-16 grid max-w-sm gap-8 lg:max-w-4xl lg:grid-cols-2">
              {/* Free Plan */}
              <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between relative">
                <div>
                  <h3 className="text-xl font-bold text-white">Free Starter</h3>
                  <p className="mt-2 text-sm text-gray-400">Perfect for quick resume healthchecks.</p>
                  <p className="mt-6 flex items-baseline">
                    <span className="text-5xl font-extrabold tracking-tight text-white">$0</span>
                    <span className="ml-1 text-sm font-semibold text-gray-400">/ forever</span>
                  </p>
                  <ul className="mt-8 space-y-4">
                    {pricingFeatures.free.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-brand-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  <Link
                    to={user ? "/dashboard" : "/signup"}
                    className="block w-full text-center rounded-lg border border-white/10 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Start Free
                  </Link>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between relative border-brand-500/40 bg-dark-800/80 ring-2 ring-brand-500/20">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                  Most Popular
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center justify-between">
                    <span>Unlimited Pro</span>
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">For job seekers serious about placement.</p>
                  <p className="mt-6 flex items-baseline">
                    <span className="text-5xl font-extrabold tracking-tight text-white">$9</span>
                    <span className="ml-1 text-sm font-semibold text-gray-400">/ month</span>
                  </p>
                  <ul className="mt-8 space-y-4">
                    {pricingFeatures.pro.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-brand-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  <Link
                    to={user ? "/billing" : "/signup"}
                    className="block w-full text-center rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-500 transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                  >
                    Upgrade to Pro
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
