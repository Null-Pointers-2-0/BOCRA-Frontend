"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminAuth } from "@/lib/api/admin";
import { Input } from "@/components/ui/input";

export default function Login() {
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
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Network error — is the backend running?",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 items-center gap-5 justify-center px-6">
      <div className="hidden w-full h-full md:flex flex-col justify-around p-4">
        <img
          src="/bocra-logo.png"
          alt="BOCRA Logo"
          className="aspect-rectangle w-32"
        />
        <div>
          <h1 className="text-5xl font-bold">
            Welcome to the BOCRA User Portal
          </h1>
          <p>You'll have to login to access your information</p>
        </div>
        <div></div>
      </div>
      <div className="w-full h-full space-y-5 flex flex-col justify-center items-center">
        <div>
          <h1 className="text-5xl font-bold">Login</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-50 p-4 w-full max-w-xl rounded-md border border-gray-300"
        >
          <div>
            <label
              htmlFor="emailOrUsername"
              className="block text-sm font-medium mb-1"
            >
              Email<span className="text-pink">*</span>
            </label>
            <Input
              id="emailOrUsername"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full"
              placeholder="admin@bocra.org.bw"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password <span className="text-pink">*</span>
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              placeholder="Password123..."
              onChange={(e) => setPassword(e.target.value)}
              className=""
              required
            />
          </div>

          <Input
            type="submit"
            disabled={loading}
            value={loading ? "Logging in" : "Log in"}
            className="w-full bg-turquoise text-white py-2 rounded-md font-medium disabled:opacity-50"
          />
        </form>
      </div>
    </div>
  );
}
