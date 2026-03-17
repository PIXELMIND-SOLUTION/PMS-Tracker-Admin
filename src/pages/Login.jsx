import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Users, Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ebe9e6] p-6">

      {/* MAIN CONTAINER */}
      <div
        className="
              relative w-full max-w-md p-10 rounded-[40px]
              bg-[#fad384]

              /* OUTER DEPTH */
              shadow-[20px_20px_45px_rgba(0,0,0,0.18),_-20px_-20px_45px_rgba(255,255,255,0.9)]

              /* subtle border for softness */
              border border-white/40
              "
      >

        {/* TOP LIGHT (inflated effect) */}
        <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-white/60 via-transparent to-transparent pointer-events-none"></div>

        {/* INNER SOFT PRESSURE */}
        <div className="absolute inset-0 rounded-[40px] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.08),inset_-6px_-6px_12px_rgba(255,255,255,0.7)] pointer-events-none"></div>

        {/* CONTENT */}
        <div className="relative z-10">
          {/* your existing content here */}
        </div>

        {/* LOGO BLOCK */}
        <div className="flex justify-center mb-6">
          <div
            className="
            h-16 w-16 flex items-center justify-center rounded-2xl
            bg-[#e6dfd2]
            shadow-[6px_6px_12px_rgba(0,0,0,0.15),_-6px_-6px_12px_rgba(255,255,255,0.7)]
            "
          >
            <Users className="text-teal-500 h-6 w-6" />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-center text-xl font-semibold text-gray-800">
          VisitorTrack Admin
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Sign in to continue
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <ErrorMessage message={error} />}

          {/* EMAIL FIELD */}
          <div
            className="
            p-3 rounded-xl bg-[#e6dfd2]
            shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]
            "
          >
            <div className="flex items-center gap-2">
              <Mail className="text-gray-500 w-4 h-4" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="
                    bg-transparent
                    w-full
                    text-sm
                    text-gray-700
                    placeholder-gray-400
                    outline-none
                    appearance-none
                  "
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div
            className="
                    p-3 rounded-2xl bg-[#e6dfd2]

                    shadow-[inset_6px_6px_10px_rgba(0,0,0,0.15),inset_-5px_-5px_10px_rgba(255,255,255,0.8)]
                    "
          >
            <div className="flex items-center gap-2">
              <Lock className="text-gray-500 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="
                      bg-transparent
                      !bg-transparent
                      w-full
                      text-sm
                      text-gray-700
                      placeholder-gray-400
                      outline-none
                      appearance-none
                    "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-1"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
                  w-full py-3 rounded-2xl text-sm font-medium
                  bg-[#d9f3ec] text-teal-700

                  shadow-[8px_8px_16px_rgba(0,0,0,0.2),_-6px_-6px_16px_rgba(255,255,255,0.8)]
                  active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.25)]

                  transition-all
                  "
          >
            {loading ? <LoadingSpinner size="sm" /> : "Sign In"}
          </button>
        </form>

        {/* DEMO */}
        <p className="text-xs text-gray-500 mt-6 text-center">
          Demo: admin@example.com / password123
        </p>
      </div>
    </div>
  );
};

export default Login;