import { FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-900 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <FileText className="h-5 w-5 text-brand-500" />
            <span>Resume<span className="text-gradient">AI</span></span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ResumeAI. All rights reserved. Built for developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
