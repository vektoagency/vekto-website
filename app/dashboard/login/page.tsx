"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/dashboard-api";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.login(password);
      router.push("/dashboard");
    } catch (err) {
      setError("Wrong password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8"
      >
        <h1 className="text-2xl font-bold mb-2">Vekto Dashboard</h1>
        <p className="text-sm text-white/60 mb-6">Enter password to continue</p>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg bg-black/40 border border-white/15 px-4 py-3 text-white outline-none focus:border-orange-500"
          placeholder="Password"
          required
        />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-orange-500 px-4 py-3 font-medium text-black hover:bg-orange-400 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
