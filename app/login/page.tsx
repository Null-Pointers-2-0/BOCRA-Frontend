"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/api/clients/auth";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login({ identifier, password });

      if (res.success) {
        router.push(redirect);
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
          <p>Log in to access your licences, applications, complaints, and more.</p>
        </div>
        <div></div>
      </div>
      <div className="w-full h-full space-y-5 flex flex-col justify-center items-center">
        <div>
          <h1 className="text-5xl font-bold">Login</h1>
        </div>

        {error && (
          <div className="w-full max-w-xl p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-50 p-4 w-full max-w-xl rounded-md border border-gray-300"
        >
          <div>
            <label
              htmlFor="emailOrUsername"
              className="block text-sm font-medium mb-1"
            >
              Email or Username<span className="text-pink">*</span>
            </label>
            <Input
              id="emailOrUsername"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full"
              placeholder="you@example.com"
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
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className=""
              required
            />
            <div className="mt-1 text-right">
              <Link href="/forgot-password" className="text-sm text-turquoise hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <Input
            type="submit"
            disabled={loading}
            value={loading ? "Logging in..." : "Log in"}
            className="w-full bg-turquoise text-white py-2 rounded-md font-medium disabled:opacity-50 cursor-pointer"
          />

          <p className="text-sm text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-turquoise hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
