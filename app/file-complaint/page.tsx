"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MagnifyingGlass,
  CheckCircle,
  WarningCircle,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import HeaderSection from "@/components/HeaderSection";
import {
  getCategories,
  submitComplaint,
} from "@/lib/api/clients/complaints";
import type { ComplaintCategoryOption } from "@/lib/api/types/complaints";
import type { ComplaintCategory } from "@/lib/api/types/common";

export default function PublicComplaintsPage() {
  const router = useRouter();

  // Categories
  const [categories, setCategories] = useState<ComplaintCategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form
  const [category, setCategory] = useState("");
  const [operator, setOperator] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successRef, setSuccessRef] = useState("");

  // Track
  const [trackRef, setTrackRef] = useState("");

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.success) setCategories(res.data ?? []);
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await submitComplaint({
        category: category as ComplaintCategory,
        against_operator_name: operator,
        subject,
        description,
        complainant_name: name,
        complainant_email: email,
        complainant_phone: phone || undefined,
      });

      if (res.success) {
        setSuccessRef(res.data.reference_number);
        setCategory("");
        setOperator("");
        setSubject("");
        setDescription("");
        setName("");
        setEmail("");
        setPhone("");
      } else {
        const errs = res.errors;
        if (errs) {
          setSubmitError(
            Object.values(errs).flat().join(". ")
          );
        } else {
          setSubmitError(res.message || "Submission failed.");
        }
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackRef.trim()) {
      router.push(`/complaints/track?ref=${encodeURIComponent(trackRef.trim())}`);
    }
  };

  // Success view
  if (successRef) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="max-w-lg w-full bg-green-50 border border-green-400 rounded-md p-8 text-center space-y-4">
            <CheckCircle size={48} weight="fill" className="text-green-600 mx-auto" />
            <h1 className="text-2xl font-semibold text-green-800">
              Complaint Submitted
            </h1>
            <p className="text-gray-700">
              Your complaint has been received. Save your reference number to
              track its progress.
            </p>
            <div className="bg-white border border-green-300 rounded-md p-4">
              <p className="text-sm text-gray-500">Reference Number</p>
              <p className="text-2xl font-bold text-gray-900 tracking-wide">
                {successRef}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setSuccessRef("")}
                variant="outline"
                className="flex-1"
              >
                Submit Another
              </Button>
              <Button
                onClick={() => router.push(`/complaints/track?ref=${encodeURIComponent(successRef)}`)}
                className="flex-1 bg-pink hover:bg-pink/90 text-white"
              >
                Track Complaint
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen mt-20 md:mt-30 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <HeaderSection
            title="File a"
            pinkText="Complaint"
            description="BOCRA will investigate consumer complaints against service providers where there is sufficient evidence of regulatory breaches."
          />

          {/* Track existing complaint */}
          <section className="bg-gray-50 border border-gray-200 rounded-md p-6">
            <h2 className="text-xl font-semibold mb-3">Track an Existing Complaint</h2>
            <form onSubmit={handleTrack} className="flex gap-3">
              <div className="relative flex-1">
                <MagnifyingGlass
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  type="text"
                  placeholder="Enter reference number (e.g. CMP-XXXXXXXX)"
                  value={trackRef}
                  onChange={(e) => setTrackRef(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
              <Button
                type="submit"
                disabled={!trackRef.trim()}
                className="bg-turquoise hover:bg-turquoise/90 text-white"
              >
                Track
              </Button>
            </form>
          </section>

          {/* Submit complaint form */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold border-l-4 border-pink pl-4">
              Submit a New Complaint
            </h2>
            <p className="text-gray-500 text-sm">
              You can file a complaint without an account. Provide your contact
              details so we can follow up.
            </p>

            {submitError && (
              <div className="bg-red-50 border border-red-400 text-red-700 p-3 rounded-md flex items-center gap-2">
                <WarningCircle size={20} />
                {submitError}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-gray-50 border border-gray-200 rounded-md p-6 space-y-6"
            >
              {/* Contact info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Your Details (optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      type="tel"
                      placeholder="+26771234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Complaint details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Complaint Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Category <span className="text-pink">*</span>
                    </label>
                    <select
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm bg-white"
                    >
                      <option value="">Select category</option>
                      {loadingCategories ? (
                        <option disabled>Loading…</option>
                      ) : (
                        categories.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Service Provider <span className="text-pink">*</span>
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Orange Botswana, BTC, Mascom"
                      value={operator}
                      onChange={(e) => setOperator(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Subject <span className="text-pink">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="Brief summary of your complaint"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="border-gray-300"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Description <span className="text-pink">*</span>
                  </label>
                  <Textarea
                    required
                    rows={5}
                    placeholder="Provide a detailed description of the issue you experienced…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border-gray-300"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-pink hover:bg-pink/90 text-white text-lg font-medium py-5 disabled:opacity-50"
              >
                {submitting ? (
                  "Submitting…"
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <PaperPlaneTilt size={20} weight="bold" />
                    Submit Complaint
                  </span>
                )}
              </Button>
            </form>
          </section>

          {/* Info cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-10">
            <div className="border-l-4 border-turquoise pl-4 space-y-2">
              <h3 className="text-lg font-bold">What happens next?</h3>
              <p className="text-gray-600 text-sm">
                BOCRA will review your complaint and may contact you for
                additional information. You will receive a reference number to
                track your complaint status.
              </p>
            </div>
            <div className="border-l-4 border-pink pl-4 space-y-2">
              <h3 className="text-lg font-bold">Have an account?</h3>
              <p className="text-gray-600 text-sm">
                <Link href="/login" className="text-pink underline">
                  Sign in
                </Link>{" "}
                to manage all your complaints, upload evidence, and receive
                real-time notifications on your complaint status.
              </p>
            </div>
            <div className="border-l-4 border-dark-teal pl-4 space-y-2">
              <h3 className="text-lg font-bold">Need help?</h3>
              <p className="text-gray-600 text-sm">
                Contact BOCRA directly at{" "}
                <a href="tel:+2673957755" className="text-turquoise underline">
                  +267 395 7755
                </a>{" "}
                or email{" "}
                <a href="mailto:info@bocra.org.bw" className="text-turquoise underline">
                  info@bocra.org.bw
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
