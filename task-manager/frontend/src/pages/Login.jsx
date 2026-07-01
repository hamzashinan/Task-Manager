import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Lock, User, Eye, EyeOff, ArrowRight, CheckSquare } from "lucide-react";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#080d1a] text-slate-100 overflow-hidden font-sans">
      {/* Left side: Premium Banner Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 flex-col justify-between p-12 overflow-hidden border-r border-slate-800/40">
        {/* Glow blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse-subtle"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>

        {/* Logo/Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <CheckSquare size={26} className="stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            TaskFlow Pro
          </span>
        </div>

        {/* Hero mockup illustration */}
        <div className="my-auto relative z-10 max-w-md mx-auto text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
            ✨ Version 2.0 Release
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-[1.1] text-white">
            Simplify your workflow, elevate your productivity.
          </h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            TaskFlow Pro brings Kanban boards, detailed task insights, and priority workflows together in one elegant workspace. Designed for builders, by builders.
          </p>

          {/* Dummy Mini Task Card Mockups */}
          <div className="space-y-3 pt-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-md transform hover:translate-x-2 transition-transform duration-300">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <div className="flex-1 text-left">
                <p className="text-xs font-medium text-slate-300">Release Production V2.0</p>
                <p className="text-[10px] text-slate-500">Priority: High • Due Today</p>
              </div>
              <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">Deploy</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-md transform hover:translate-x-2 transition-transform duration-300 delay-75">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
              <div className="flex-1 text-left">
                <p className="text-xs font-medium text-slate-300">Design Team Retrospective</p>
                <p className="text-[10px] text-slate-500">Priority: Medium • Tomorrow</p>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded">Meeting</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 relative z-10">
          © {new Date().getFullYear()} TaskFlow Pro. All rights reserved.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        {/* Glow blobs on right */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none"></div>

        <div className="w-full max-w-md space-y-8 animate-slide-up relative z-10">
          {/* Form Header */}
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-slate-400 text-sm">
              Please enter your details to access your dashboard.
            </p>
          </div>

          {/* Form container */}
          <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800/50 backdrop-blur-xl shadow-xl space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-200 placeholder:text-slate-600 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-200 placeholder:text-slate-600 text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-indigo-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Form Footer */}
          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;