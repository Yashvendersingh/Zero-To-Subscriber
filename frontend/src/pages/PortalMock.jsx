import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { CreditCard, ArrowLeft, LogOut, CheckCircle, FileText, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function PortalMock() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your Pro plan? Your access will return to the Free Tier limit.")) {
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Cancelling subscription via Stripe Sandbox...");

    try {
      await api.post("/api/v1/billing/webhook-mock", {
        user_id: userId,
        action: "cancel",
      });
      
      await refreshUser();
      toast.success("Subscription cancelled successfully.", { id: toastId });
      navigate("/billing");
    } catch (err) {
      toast.error("Failed to cancel subscription.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-white py-12">
      <div className="mx-auto max-w-2xl px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate("/billing")} 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </button>
          
          <div className="flex items-center gap-1.5 font-bold text-base">
            <FileText className="h-5 w-5 text-brand-500" />
            <span>Resume<span className="text-gradient">AI</span> Billing</span>
          </div>
        </div>

        {/* Sandbox Warning */}
        <div className="mb-6 rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-500 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Stripe Sandbox Billing Portal</span>: This dashboard simulates your active subscription records on Stripe. You can cancel your subscription below to test downgrading rate-limits.
          </div>
        </div>

        {/* Portal card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-8">
          <div>
            <h2 className="text-xl font-bold">Current Subscription</h2>
            <div className="mt-4 rounded-lg bg-dark-800/40 p-4 border border-white/5 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">ResumeAI Pro</p>
                <p className="text-xs text-gray-500 mt-1">$9.00 / month</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="h-3.5 w-3.5" /> Active
              </span>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6">
            <h3 className="text-base font-bold text-white mb-2">Cancel Subscription</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              If you cancel, you will lose unlimited access and be restricted to the 3 evaluations per month Free Tier limit immediately.
            </p>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-4 py-2.5 text-sm font-semibold text-rose-400 transition-all"
            >
              {loading ? "Cancelling..." : "Cancel Subscription"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
