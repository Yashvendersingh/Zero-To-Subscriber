import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FileText, ArrowLeft, Send, Sparkles, AlertCircle, Upload, X, FileUp } from "lucide-react";
import toast from "react-hot-toast";

export default function NewReviewPage() {
  const { user, refreshUser } = useAuth();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [inputMode, setInputMode] = useState("upload"); // 'upload' or 'paste'
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const isLimitReached = user?.plan === "free" && user?.reviews_this_month >= 20;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    const allowedExts = ['.pdf', '.docx', '.txt'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      toast.error("Please upload a PDF, DOCX, or TXT file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setUploadedFile(file);
    setResumeText(""); // Clear text when file is uploaded
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputMode === "upload" && !uploadedFile) {
      toast.error("Please upload your resume file");
      return;
    }
    if (inputMode === "paste" && !resumeText.trim()) {
      toast.error("Please provide your resume content");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please provide the job description");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("AI is evaluating your resume... (takes a few seconds)");

    try {
      let response;

      if (inputMode === "upload" && uploadedFile) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append("resume_file", uploadedFile);
        formData.append("job_description", jobDescription);
        response = await api.post("/api/v1/reviews/upload", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Use JSON for pasted text
        response = await api.post("/api/v1/reviews", {
          resume_text: resumeText,
          job_description: jobDescription,
        });
      }

      await refreshUser();
      toast.success("Evaluation complete!", { id: toastId });
      navigate(`/reviews/${response.data.id}`);
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Failed to analyze resume. Please try again.";
      toast.error(errMsg, { id: toastId });

      if (err.response?.status === 403) {
        navigate("/billing");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-brand-500" />
              New Resume Matcher
            </h1>
            <p className="text-gray-400 mt-1">Upload your resume and paste the job description to get AI-powered analysis.</p>
          </div>

          {user?.plan === "free" && (
            <span className="text-xs text-gray-400 bg-dark-800 border border-white/5 rounded-lg px-3 py-1.5 flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-brand-400" />
              {20 - user.reviews_this_month} out of 20 reviews remaining
            </span>
          )}
        </div>

        {isLimitReached ? (
          <div className="glass-panel p-8 rounded-xl text-center border-rose-500/20 max-w-xl mx-auto mt-12">
            <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Monthly Limit Reached</h2>
            <p className="text-gray-400 text-sm mb-6">
              You have used all 20 free evaluations for this month. Upgrade to our Pro plan to evaluate unlimited resumes and unlock priority AI matching.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/dashboard"
                className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/billing"
                className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/20"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Resume Input Panel */}
              <div className="flex flex-col gap-2">
                <label className="block text-base font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand-400" />
                  Your Resume
                </label>

                {/* Toggle: Upload / Paste */}
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setInputMode("upload")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      inputMode === "upload"
                        ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                        : "bg-dark-800 text-gray-400 border border-white/10 hover:text-white"
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => { setInputMode("paste"); removeFile(); }}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      inputMode === "paste"
                        ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                        : "bg-dark-800 text-gray-400 border border-white/10 hover:text-white"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Paste Text
                  </button>
                </div>

                {inputMode === "upload" ? (
                  <div className="mt-2">
                    {!uploadedFile ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center h-[320px] rounded-lg border-2 border-dashed border-white/10 bg-dark-800/50 cursor-pointer hover:border-brand-500/50 hover:bg-dark-800/80 transition-all group"
                      >
                        <FileUp className="h-12 w-12 text-gray-600 group-hover:text-brand-400 transition-colors mb-3" />
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          <span className="text-brand-400 font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-600 mt-1">PDF, DOCX, or TXT (Max 5MB)</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 h-[320px] rounded-lg border border-white/10 bg-dark-800/50 p-6">
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-3">
                            <FileText className="h-8 w-8 text-brand-400" />
                          </div>
                          <p className="text-sm text-white font-semibold truncate max-w-full">{uploadedFile.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="mt-4 flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                            Remove file
                          </button>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-gray-500">
                      Copy and paste the plain text of your resume (experience, skills, contact).
                    </p>
                    <textarea
                      disabled={loading}
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste resume content here..."
                      className="mt-2 block w-full h-[320px] rounded-lg border border-white/10 bg-dark-800/50 p-4 text-sm text-white placeholder-gray-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all font-mono resize-none"
                    ></textarea>
                  </div>
                )}
              </div>

              {/* JD Input Panel */}
              <div className="flex flex-col gap-2">
                <label className="block text-base font-bold text-white flex items-center gap-2">
                  <Send className="h-5 w-5 text-accent-500" />
                  Target Job Description
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Copy and paste the target job description or requirements summary.
                </p>
                <textarea
                  required
                  disabled={loading}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job description requirements here..."
                  className="mt-2 block w-full h-[320px] rounded-lg border border-white/10 bg-dark-800/50 p-4 text-sm text-white placeholder-gray-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all font-mono resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5 mt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white hover:bg-brand-500 disabled:opacity-50 transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                <Sparkles className="h-5 w-5" />
                <span>{loading ? "Analyzing resume..." : "Start Evaluation"}</span>
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
