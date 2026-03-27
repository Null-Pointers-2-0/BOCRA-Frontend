"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail, resendVerification } from "@/lib/api/clients/auth";
import Link from "next/link";

type Status = "loading" | "success" | "error" | "already-verified";

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    verifyEmail(token).then((res) => {
      if (res.success) {
        if (res.message?.toLowerCase().includes("already")) {
          setStatus("already-verified");
        } else {
          setStatus("success");
        }
        setMessage(res.message || "Email verified successfully.");
      } else {
        setStatus("error");
        setMessage(res.message || "Invalid or expired verification token.");
      }
    }).catch(() => {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    });
  }, [token]);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    if (!resendEmail) return;
    setResending(true);
    setResendMessage("");

    try {
      const res = await resendVerification(resendEmail);
      setResendMessage(res.message || "If that email is registered and unverified, a new link has been sent.");
    } catch {
      setResendMessage("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <img src="/bocra-logo.png" alt="BOCRA" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Email Verification</h1>
        </div>

        {status === "loading" && (
          <div className="text-center p-6 bg-white rounded-lg border">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-turquoise mx-auto mb-3"></div>
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <div className="p-6 bg-white rounded-lg border border-green-200 text-center">
            <div className="text-green-600 text-4xl mb-3">&#10003;</div>
            <h2 className="text-lg font-semibold text-green-700 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <Link
              href="/login"
              className="inline-block bg-turquoise text-white px-6 py-2 rounded-md font-medium hover:opacity-90"
            >
              Continue to Login
            </Link>
          </div>
        )}

        {status === "already-verified" && (
          <div className="p-6 bg-white rounded-lg border text-center">
            <p className="text-gray-600 mb-4">{message}</p>
            <Link
              href="/login"
              className="inline-block bg-turquoise text-white px-6 py-2 rounded-md font-medium hover:opacity-90"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="p-6 bg-white rounded-lg border border-red-200 text-center">
              <div className="text-red-500 text-4xl mb-3">&#10007;</div>
              <h2 className="text-lg font-semibold text-red-700 mb-2">Verification Failed</h2>
              <p className="text-gray-600">{message}</p>
            </div>

            <div className="p-6 bg-white rounded-lg border">
              <h3 className="text-sm font-semibold mb-3">Resend verification email</h3>
              <form onSubmit={handleResend} className="space-y-3">
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
                <button
                  type="submit"
                  disabled={resending}
                  className="w-full bg-turquoise text-white py-2 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {resending ? "Sending..." : "Resend Link"}
                </button>
              </form>
              {resendMessage && (
                <p className="mt-2 text-sm text-gray-600">{resendMessage}</p>
              )}
            </div>

            <p className="text-center text-sm text-gray-500">
              <Link href="/login" className="text-turquoise hover:underline">Back to Login</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
