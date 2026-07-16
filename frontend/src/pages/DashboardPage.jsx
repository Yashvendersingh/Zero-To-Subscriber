import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PlusCircle, FileText, ArrowRight, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/api/v1/reviews");
      setReviews(response.data);
    } catch (err) {
      toast.error("Failed to load evaluation history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getScoreBadge = (score) => {
    if (score >= 80) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
          <CheckCircle className="h-3 w-3" />
          {score} - Excellent
        </span>
      );
    }
    if (score >= 60) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
          <AlertTriangle className="h-3 w-3" />
          {score} - Moderate
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400 border border-rose-500/20">
        <AlertTriangle className="h-3 w-3" />
        {score} - Needs Work
      </span>
    );
  };

  const getLimitPercentage = () => {
    if (!user) return 0;
    if (user.plan === "pro") return 100;
    return Math.min((user.reviews_this_month / 20) * 100, 100);
  };

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Welcome back, {user?.full_name || "Developer"}!</h1>
            <p className="text-gray-400 mt-1">Manage and evaluate your resumes against job openings.</p>
          </div>
          <Link
            to="/reviews/new"
            className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-500 transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Evaluation</span>
          </Link>
        </div>

        {/* Plan & Usage Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 glass-panel p-6 rounded-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Usage This Month</h2>
              <div className="flex items-baseline gap-2 mb-4">
                {user?.plan === "pro" ? (
                  <>
                    <span className="text-3xl font-extrabold text-white">Unlimited</span>
                    <span className="text-sm text-gray-400">evaluations active</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-extrabold text-white">{user?.reviews_this_month}</span>
                    <span className="text-sm text-gray-400">/ 20 reviews used</span>
                  </>
                )}
              </div>
              
              {user?.plan !== "pro" && (
                <div className="w-full bg-dark-800 h-2.5 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      user?.reviews_this_month >= 20 ? "bg-rose-500" : "bg-brand-500"
                    }`}
                    style={{ width: `${getLimitPercentage()}%` }}
                  ></div>
                </div>
              )}
            </div>

            {user?.plan !== "pro" && (
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/5 pt-4">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Limits reset monthly. Upgrade to bypass.
                </span>
                <Link
                  to="/billing"
                  className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                >
                  Unlock Unlimited Pro
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>

          <div className="glass-panel p-6 rounded-xl bg-gradient-to-br from-brand-600/10 to-accent-500/10 border-brand-500/20 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-white text-lg">ResumeAI Pro</h3>
              <p className="text-sm text-gray-400 mt-2">
                Evaluate unlimited resumes, access advanced ATS matching metrics, and tailor your profile for $9/mo.
              </p>
            </div>
            {user?.plan === "pro" ? (
              <div className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-bold text-emerald-400">
                <CheckCircle className="h-4 w-4" /> Pro Subscription is Active
              </div>
            ) : (
              <Link
                to="/billing"
                className="mt-6 block w-full text-center rounded-lg bg-brand-600 py-2.5 text-xs font-bold text-white hover:bg-brand-500 transition-all"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>

        {/* History Table */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-white mb-6">Evaluation History</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 w-full bg-dark-800 animate-pulse rounded-lg border border-white/5"></div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="glass-panel rounded-xl p-12 text-center flex flex-col items-center">
              <FileText className="h-12 w-12 text-gray-600 mb-4" />
              <h3 className="font-semibold text-lg text-white">No evaluations yet</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-md">
                Upload your first resume and compare it against a target job description to see detailed scoring.
              </p>
              <Link
                to="/reviews/new"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 transition-all"
              >
                Create first evaluation
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-left border-collapse bg-dark-800/20">
                <thead>
                  <tr className="border-b border-white/5 bg-dark-800/40 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="p-4">Target Role / Job</th>
                    <th className="p-4">Evaluated On</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">ATS Match Score</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-white line-clamp-1 max-w-xs sm:max-w-md">
                            {review.job_description.split("\n")[0] || "Target Job Opening"}
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {review.resume_text.slice(0, 60)}...
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">
                        {new Date(review.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium uppercase ${
                            review.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : review.status === "failed"
                              ? "bg-rose-500/10 text-rose-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {review.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {review.status === "completed" ? (
                          getScoreBadge(review.overall_score)
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {review.status === "completed" ? (
                          <Link
                            to={`/reviews/${review.id}`}
                            className="text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                          >
                            View Details
                          </Link>
                        ) : (
                          <span className="text-gray-500 text-sm">Unavailable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
