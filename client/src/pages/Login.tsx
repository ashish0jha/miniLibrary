import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ApiError } from "../types";
import axios from "axios";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const isEmail = identifier.includes("@");

    try {
      await login(
        isEmail ? undefined : identifier,
        isEmail ? identifier : undefined,
        password
      );
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError<ApiError>(err)) {
        setError(err.response?.data?.error ?? "Login failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-indigo-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">MiniLibrary</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back — log in to continue</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/50 space-y-4"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Username or Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="jane_doe or jane@mail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg py-2.5 transition shadow-lg shadow-indigo-600/20"
          >
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}