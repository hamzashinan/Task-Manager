import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center p-6 text-slate-100 font-sans relative">
      {/* Background glow blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full text-center space-y-6 animate-slide-up relative z-10">
        {/* Visual 404 graphic */}
        <div className="inline-flex p-4 rounded-2xl bg-indigo-650/10 border border-indigo-500/25 text-indigo-400">
          <AlertCircle size={40} className="stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-white tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-200">Page not found</h2>
          <p className="text-xs text-slate-450 leading-relaxed max-w-xs mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/10 cursor-pointer transition-all duration-200"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
