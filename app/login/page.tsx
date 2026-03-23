"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminAuth } from "@/lib/api/admin";

export default function TestLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await adminAuth.login({ identifier, password });

      setResponse(JSON.stringify(res, null, 2));

      if (res.success) {
        setTimeout(() => router.push("/test-dashboard"), 1000);
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error — is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Test Login</h1>
          <p className="text-sm text-gray-500 mt-1">
            Backend: {process.env.NEXT_PUBLIC_API_URL}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label htmlFor="emailOrUsername" className="block text-sm font-medium mb-1">Email or Username <span className="text-pink">*</span></label>
            <input
              id="emailOrUsername"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full border border-gray-500 px-3 py-2 text-sm"
              placeholder="admin@bocra.org.bw"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password <span className="text-pink">*</span></label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Password123..."
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-500 px-3 py-2 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0073ae] text-white py-2 rounded font-medium hover:bg-[#005f8f] disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : "Login"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {response && (
          <div className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto max-h-96">
            <p className="text-gray-400 mb-2 font-medium">Raw API Response:</p>
            <pre>{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
