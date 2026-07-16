import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CreditCard, Check, Zap, Shield, CheckCircle, ExternalLink, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function BillingPage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [billingDetails, setBillingDetails] = useState(null);

  const fetchBillingStatus = async () => {
    try {
      const response = await api.get("/api/v1/billing/status");
      setBillingDetails(response.data);
    } catch (err) {
      console.error("Failed to load billing status:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBillingStatus();
    }
  }, [user]);

  const handleSubscribe = async () => {
    setLoading(true);
    const toastId = toast.loading("Preparing checkout session...");

    try {
      const response = await api.post("/api/v1/billing/checkout", {
        price_id: "", // Sent as empty to default to settings.STRIPE_PRICE_PRO on backend
      });
      
      toast.success("Redirecting to checkout...", { id: toastId });
      // Redirect to Stripe checkout page (or local mock page)
      window.location.href = response.data.url;
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Could not start subscription checkout.";
      toast.error(errMsg, { id: toastId });
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setLoading(true);
    const toastId = toast.loading("Opening billing dashboard...");

    try {
      const response = await api.post("/api/v1/billing/portal");
      toast.success("Redirecting...", { id: toastId });
      window.location.href = response.data.url;
    } catch (err) {
      toast.error("Failed to open billing settings.", { id: toastId });
      setLoading(false);
    }
  };

  const proFeatures = [
    "Unlimited resume evaluations",
    "Detailed ATS keyword scoring checks",
    "Priority AI processing (Gemini 1.5 Flash)",
    "Downloadable PDF formatting suggestions",
    "Actionable sectional matching insights",
    "Saved review history forever",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl flex items-center justify-center gap-2">
            <CreditCard className="h-8 w-8 text-brand-500" />
            Subscription & Billing
          </h1>
          <p className="text-gray-400 mt-2">Manage your plan, check monthly limits, and modify your subscription.</p>
        </div>

        {/* Current Plan Overview Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Active Plan</span>
            <div className="flex items-center gap-2.5 mt-1">
              <h2 className="text-2xl font-bold text-white capitalize">{user?.plan || "Free"} Plan</h2>
              {user?.plan === "pro" && (
                <span className="inline-flex items-center gap-1 rounded bg-accent-500/10 px-2.5 py-0.5 text-xs font-semibold text-accent-600 border border-accent-500/20">
                  Active
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-2">
              {user?.plan === "pro"
                ? "You have full unlocked access to all Pro features with unlimited scans."
                : `Used ${user?.reviews_this_month || 0} of 20 free resume reviews for this period.`}
            </p>
          </div>

          <div className="flex-shrink-0 w-full sm:w-auto">
            {user?.plan === "pro" ? (
              <button
                onClick={handleManageBilling}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-50 transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                <span>Manage Subscriptions</span>
                <ExternalLink className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 text-sm font-semibold text-white hover:from-brand-500 hover:to-brand-600 disabled:opacity-50 transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>Upgrade to Pro — $9/mo</span>
              </button>
            )}
          </div>
        </div>

        {/* Pricing tier boxes (if Free user) */}
        {user?.plan !== "pro" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            
            {/* Free tier card */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between opacity-60 border-white/5">
              <div>
                <h3 className="text-lg font-bold text-gray-400">Starter Free</h3>
                <p className="text-xs text-gray-500 mt-1">Simple resume screening.</p>
                <p className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-gray-500 ml-1">/ month</span>
                </p>
                <ul className="mt-8 space-y-3">
                  <li className="flex items-start gap-2 text-xs text-gray-300">
                    <Check className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span>20 evaluations per month</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-gray-300">
                    <Check className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span>Standard processing speed</span>
                  </li>
                </ul>
              </div>
              <button disabled className="mt-8 block w-full rounded-lg border border-white/5 py-2 text-xs text-gray-500 text-center font-bold">
                Your Current Plan
              </button>
            </div>

            {/* Pro tier card */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between border-brand-500/30 bg-dark-800 relative">
              <div className="absolute -top-3 right-6 rounded-full bg-brand-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Best Value
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Unlimited Pro</h3>
                <p className="text-xs text-gray-400 mt-1">Designed for serious active job seekers.</p>
                <p className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$9</span>
                  <span className="text-xs text-gray-400 ml-1">/ month</span>
                </p>
                <ul className="mt-8 space-y-3">
                  {proFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                      <Check className="h-4 w-4 text-brand-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="mt-8 block w-full rounded-lg bg-brand-600 py-2.5 text-xs text-white text-center font-bold hover:bg-brand-500 transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                {loading ? "Loading..." : "Get Unlimited Access"}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
