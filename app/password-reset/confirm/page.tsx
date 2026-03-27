"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmPasswordReset } from "@/lib/api/clients/auth";
import Link from "next/link";
import { Input } from "@/components/ui/input";

function PasswordResetConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const invalidLink = !uid || !token;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await confirmPasswordReset({
        uid,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(res.message || "Password reset failed. The link may have expired.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (invalidLink) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-3xl font-bold">Invalid Reset Link</h1>
          <p className="text-gray-600">
            This password reset link is invalid or incomplete.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block text-turquoise hover:underline font-medium"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Password Reset</h1>
          <p className="text-gray-600">
            Your password has been reset successfully. Redirecting to login…
          </p>
          <Link href="/login" className="inline-block text-turquoise hover:underline font-medium">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-5">
        <div>
          <h1 className="text-3xl font-bold">Set New Password</h1>
          <p className="text-gray-600 mt-1">Enter your new password below.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-50 p-4 rounded-md border border-gray-300"
        >
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
              New Password<span className="text-pink">*</span>
            </label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password<span className="text-pink">*</span>
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <Input
            type="submit"
            disabled={loading}
            value={loading ? "Resetting…" : "Reset Password"}
            className="w-full bg-turquoise text-white py-2 rounded-md font-medium disabled:opacity-50 cursor-pointer"
          />

          <p className="text-sm text-center text-gray-600">
            <Link href="/login" className="text-turquoise hover:underline font-medium">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function PasswordResetConfirm() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <PasswordResetConfirmContent />
    </Suspense>
  );
}
