import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScoreGauge from "../components/ScoreGauge";
import { ArrowLeft, RefreshCw, AlertCircle, Check, Star, Sparkles, GraduationCap, Briefcase, Wrench, X, Lightbulb, BookOpen, TrendingUp, Award } from "lucide-react";
import toast from "react-hot-toast";

function MatchBadge({ match }) {
  if (match === true || match === "yes" || match === "Yes") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
        <Check className="h-3 w-3" /> Match
      </span>
    );
  }
  if (match === "partial" || match === "Partial") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/20">
        <AlertCircle className="h-3 w-3" /> Partial
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/20">
      <X className="h-3 w-3" /> Gap
    </span>
  );
}

export default function ReviewResultPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReviewDetail = async () => {
    try {
      const response = await api.get(`/api/v1/reviews/${id}`);
      setReview(response.data);
    } catch (err) {
      toast.error("Failed to load review details");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm animate-pulse">Loading report details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!review) return null;

  const score = review.overall_score || 0;
  const feedbackData = review.feedback || {};
  const sections = feedbackData.sections || {};
  const suggestions = feedbackData.suggestions || [];
  const keywords = sections.keywords || { found: [], missing: [] };
  const isMock = feedbackData.is_mock;

  // Enhanced sections
  const skillsAnalysis = sections.skills_analysis || null;
  const experienceAnalysis = sections.experience_analysis || null;
  const educationAnalysis = sections.education_analysis || null;

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <Link
            to="/reviews/new"
            className="inline-flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors font-semibold"
          >
            <RefreshCw className="h-4 w-4" />
            Evaluate Another
          </Link>
        </div>

        {isMock && (
          <div className="mb-6 flex items-start gap-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-4 text-sm text-indigo-300">
            <Sparkles className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Sandbox Evaluation</span>: The Gemini API call fell back to a simulated review. This happens if the Gemini API Key is missing in `.env` or if your Google AI Studio free tier rate limits (15 requests/min or token limits) were exceeded.
            </div>
          </div>
        )}

        {/* Hero Section Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 mb-8">
          <ScoreGauge score={score} size={130} strokeWidth={11} />

          <div className="flex-1 text-center md:text-left">
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
              ATS Match Report
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 line-clamp-2">
              {review.job_description.split("\n")[0] || "Target Role Match"}
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-2xl">
              Completed on {new Date(review.created_at).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
        </div>

        {/* Section Scores + Keywords sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left 2 cols: Main report */}
          <div className="md:col-span-2 space-y-8">

            {/* Score Bars */}
            <div className="glass-panel rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-white/5 pb-3">Section Scores</h2>

              {sections.skills_match && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-white">Technical Skills Match</span>
                    <span className="text-brand-400 font-bold">{sections.skills_match.score}%</span>
                  </div>
                  <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand-500 h-full rounded-full transition-all duration-700" style={{ width: `${sections.skills_match.score}%` }}></div>
                  </div>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">{sections.skills_match.feedback}</p>
                </div>
              )}

              {sections.experience_match && (
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-white">Work Experience Relevance</span>
                    <span className="text-accent-600 font-bold">{sections.experience_match.score}%</span>
                  </div>
                  <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-accent-500 h-full rounded-full transition-all duration-700" style={{ width: `${sections.experience_match.score}%` }}></div>
                  </div>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">{sections.experience_match.feedback}</p>
                </div>
              )}

              {sections.formatting && (
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-white">ATS Formatting & Layout</span>
                    <span className="text-emerald-400 font-bold">{sections.formatting.score}%</span>
                  </div>
                  <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${sections.formatting.score}%` }}></div>
                  </div>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">{sections.formatting.feedback}</p>
                </div>
              )}

              {sections.education_match && (
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-white">Education Match</span>
                    <span className="text-violet-400 font-bold">{sections.education_match.score}%</span>
                  </div>
                  <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-violet-500 h-full rounded-full transition-all duration-700" style={{ width: `${sections.education_match.score}%` }}></div>
                  </div>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">{sections.education_match.feedback}</p>
                </div>
              )}
            </div>

            {/* Skills Deep-Dive */}
            {skillsAnalysis && (
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-xl font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-brand-400" />
                  Skills Deep-Dive
                </h2>

                {/* Matched Skills */}
                {skillsAnalysis.matched_skills && skillsAnalysis.matched_skills.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Matched Skills ({skillsAnalysis.matched_skills.length})</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {skillsAnalysis.matched_skills.map((skill, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                          <Check className="h-3 w-3" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills with Suggestions */}
                {skillsAnalysis.missing_skills && skillsAnalysis.missing_skills.length > 0 && (
                  <div className="mt-5 border-t border-white/5 pt-4">
                    <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3">Missing Skills — Add These ({skillsAnalysis.missing_skills.length})</h3>
                    <div className="space-y-3">
                      {skillsAnalysis.missing_skills.map((item, idx) => (
                        <div key={idx} className="rounded-lg bg-rose-500/5 border border-rose-500/10 p-3">
                          <div className="flex items-center gap-2">
                            <X className="h-4 w-4 text-rose-400 flex-shrink-0" />
                            <span className="text-sm font-semibold text-rose-300">{typeof item === 'string' ? item : item.skill}</span>
                          </div>
                          {typeof item === 'object' && item.suggestion && (
                            <p className="text-xs text-gray-400 mt-1.5 ml-6 flex items-start gap-1.5">
                              <Lightbulb className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                              {item.suggestion}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Experience Analysis */}
            {experienceAnalysis && (
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-xl font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-accent-500" />
                  Experience Analysis
                </h2>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-dark-800/50 border border-white/5 p-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Required Experience</p>
                      <p className="text-sm text-white font-semibold mt-0.5">{experienceAnalysis.required || "Not specified"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Your Experience</p>
                      <p className="text-sm text-white font-semibold mt-0.5">{experienceAnalysis.candidate_has || "Not detected"}</p>
                    </div>
                    <MatchBadge match={experienceAnalysis.match} />
                  </div>
                  {experienceAnalysis.feedback && (
                    <p className="text-xs text-gray-400 leading-relaxed">{experienceAnalysis.feedback}</p>
                  )}
                  {experienceAnalysis.suggestions && experienceAnalysis.suggestions.length > 0 && (
                    <div className="space-y-2">
                      {experienceAnalysis.suggestions.map((sug, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                          <TrendingUp className="h-3.5 w-3.5 text-accent-400 flex-shrink-0 mt-0.5" />
                          <span>{sug}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Education Analysis */}
            {educationAnalysis && (
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-xl font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-violet-400" />
                  Education Analysis
                </h2>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-dark-800/50 border border-white/5 p-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Required Education</p>
                      <p className="text-sm text-white font-semibold mt-0.5">{educationAnalysis.required || "Not specified"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Your Education</p>
                      <p className="text-sm text-white font-semibold mt-0.5">{educationAnalysis.candidate_has || "Not detected"}</p>
                    </div>
                    <MatchBadge match={educationAnalysis.match} />
                  </div>
                  {educationAnalysis.feedback && (
                    <p className="text-xs text-gray-400 leading-relaxed">{educationAnalysis.feedback}</p>
                  )}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-xl font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-400" />
                  Key Recommendations
                </h2>
                <ul className="mt-4 space-y-3">
                  {suggestions.map((sug, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-gray-300 leading-relaxed items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500/10 text-brand-400 font-bold flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right sidebar: Keywords */}
          <div className="space-y-8">
            <div className="glass-panel rounded-xl p-6">
              <h2 className="text-lg font-bold text-white border-b border-white/5 pb-3">ATS Keywords Check</h2>

              <div className="mt-4">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Found ({keywords.found.length})</h3>
                {keywords.found.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No matching keywords found</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {keywords.found.map((key, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                        <Check className="h-3 w-3" />
                        {key}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-white/5 pt-4">
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">Missing from Resume ({keywords.missing.length})</h3>
                {keywords.missing.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No critical keywords missing!</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {keywords.missing.map((key, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-400 border border-rose-500/20">
                        <AlertCircle className="h-3 w-3" />
                        {key}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick summary card for education and experience match */}
            {(experienceAnalysis || educationAnalysis) && (
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-lg font-bold text-white border-b border-white/5 pb-3">Quick Match Summary</h2>
                <div className="mt-4 space-y-3">
                  {experienceAnalysis && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-accent-400" />
                        <span className="text-sm text-gray-300">Experience</span>
                      </div>
                      <MatchBadge match={experienceAnalysis.match} />
                    </div>
                  )}
                  {educationAnalysis && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-violet-400" />
                        <span className="text-sm text-gray-300">Education</span>
                      </div>
                      <MatchBadge match={educationAnalysis.match} />
                    </div>
                  )}
                  {skillsAnalysis && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-brand-400" />
                        <span className="text-sm text-gray-300">Skills</span>
                      </div>
                      <span className="text-xs font-bold text-brand-400">
                        {skillsAnalysis.matched_skills?.length || 0} / {(skillsAnalysis.matched_skills?.length || 0) + (skillsAnalysis.missing_skills?.length || 0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
