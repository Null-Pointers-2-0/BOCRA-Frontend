"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/lib/api/clients/auth";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await requestPasswordReset({ email });
      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.message || "Something went wrong.");
      }
    } catch {
      setError("Network error — is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <img src="/bocra-logo.png" alt="BOCRA" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-white rounded-lg border border-green-200 text-center space-y-3">
            <div className="text-green-600 text-4xl">&#9993;</div>
            <h2 className="text-lg font-semibold text-green-700">Check your email</h2>
            <p className="text-gray-600 text-sm">
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link.
              Check your inbox (and spam folder).
            </p>
            <p className="text-sm text-gray-500 pt-2">
              <Link href="/login" className="text-turquoise hover:underline">Back to Login</Link>
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 bg-white rounded-lg border space-y-4"
          >
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address <span className="text-pink">*</span>
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full"
              />
            </div>

            <Input
              type="submit"
              disabled={loading}
              value={loading ? "Sending..." : "Send Reset Link"}
              className="w-full bg-turquoise text-white py-2 rounded-md font-medium disabled:opacity-50 cursor-pointer"
            />

            <p className="text-center text-sm text-gray-500">
              Remember your password?{" "}
              <Link href="/login" className="text-turquoise hover:underline">Log in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
