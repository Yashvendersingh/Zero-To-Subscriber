import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { FileText, ArrowLeft, ShieldCheck, CreditCard, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckoutMock() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const priceId = searchParams.get("price_id");
  
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handlePay = async (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvc || !name) {
      toast.error("Please fill in all card details");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Processing payment via Stripe Sandbox...");

    try {
      // Simulate Stripe Webhook completion locally
      await api.post("/api/v1/billing/webhook-mock", {
        user_id: userId,
        action: "upgrade",
      });
      
      toast.success("Payment succeeded! Upgraded to Pro.", { id: toastId });
      navigate("/dashboard");
    } catch (err) {
      toast.error("Sandbox payment failed.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setCardNumber("4242 4242 4242 4242");
    setExpiry("12/30");
    setCvc("123");
    setName("Demo User");
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-dark-900 text-slate-900 dark:text-white flex flex-col md:flex-row">
      
      {/* Left Pane (Order Summary) */}
      <div className="w-full md:w-5/12 bg-slate-50 dark:bg-dark-800 p-8 sm:p-12 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 flex flex-col justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Cancel and Return
          </button>
          
          <div className="flex items-center gap-2 font-bold text-xl mb-12">
            <FileText className="h-6 w-6 text-brand-500" />
            <span>Resume<span className="text-gradient">AI</span></span>
            <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Stripe Sandbox</span>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscribe to</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">ResumeAI Pro</h2>
            <div className="flex items-baseline mt-4 text-slate-900 dark:text-white">
              <span className="text-5xl font-black tracking-tight">$9.00</span>
              <span className="text-sm font-semibold ml-2 text-gray-500">per month</span>
            </div>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              Unlimited resume matches, ATS keyword checklists, priority evaluations, and downloadable optimization advice.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-white/5 text-xs text-gray-500 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Secure SSL connection. Sandbox simulated transaction.</span>
          </div>
        </div>
      </div>

      {/* Right Pane (Card form) */}
      <div className="flex-1 p-8 sm:p-12 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Payment Method</h3>
            <button 
              onClick={handleFillDemo}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 bg-brand-500/5 px-2.5 py-1 rounded border border-brand-500/20 transition-all"
            >
              Autofill Test Card
            </button>
          </div>

          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Card Information</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  required
                  type="text"
                  placeholder="1234 5678 1234 5678"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-dark-800 py-3 pl-10 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">MM / YY</label>
                <input
                  required
                  type="text"
                  placeholder="12/28"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-dark-800 py-3 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">CVC</label>
                <input
                  required
                  type="text"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-dark-800 py-3 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Name on Card</label>
              <input
                required
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-dark-800 py-3 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 rounded-lg bg-brand-600 px-4 py-3.5 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-50 transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] mt-6"
            >
              <Lock className="h-4 w-4" />
              <span>{loading ? "Processing Securely..." : "Subscribe for $9.00/mo"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
