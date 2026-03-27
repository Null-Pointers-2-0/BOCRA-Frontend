"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/clients/auth";
import type { RegisterRequest } from "@/lib/api/types/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Signup() {
  const [formData, setFormData] = useState<RegisterRequest>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
    id_number: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const router = useRouter();

  const handleInputChange = (field: keyof RegisterRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "password" || field === "confirm_password") {
      setPasswordError("");
    }

    if (submitError) setSubmitError("");
    if (submitSuccess) setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");
    setSubmitError("");
    setIsLoading(true);

    try {
      const response = await register(formData);

      if (response.success) {
        console.log("Signup successful:", response.data);
        setSubmitSuccess(true);

        // Reset form
        setFormData({
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          password: "",
          confirm_password: "",
          phone_number: "",
          id_number: "",
        });

        // Redirect to login after successful signup
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        throw new Error(
          response.errors
            ? Object.values(response.errors).flat().join(", ")
            : "Registration failed",
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "An error occurred during signup",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full py-10 flex flex-col md:justify-center md:items-center space-y-5 px-6">
      <h1 className="text-3xl font-bold">Signup</h1>

      {/* Success Message */}
      {submitSuccess && (
        <div className="w-full max-w-2xl p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-semibold">Account created successfully!</p>
          <p className="text-sm">
            Please check your email to verify your account before logging in.
          </p>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="w-full max-w-2xl p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-semibold">Error:</p>
          <p className="text-sm">{submitError}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full grid rounded-md grid-cols-1 md:grid-cols-2 max-w-2xl p-4 bg-gray-50 gap-4 border border-gray-300"
      >
        <div>
          <label htmlFor="first-name" className="block mb-2">
            First Name
            <span className="text-pink">*</span>
          </label>
          <Input
            id="first-name"
            type="text"
            required
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
            className="w-full p-2"
          />
        </div>

        <div>
          <label htmlFor="last-name" className="block mb-2">
            Last Name
            <span className="text-pink">*</span>
          </label>
          <Input
            id="last-name"
            required
            type="text"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
            className="w-full p-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-2">
            Email
            <span className="text-pink">*</span>
          </label>
          <Input
            required
            id="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full p-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2">
            Password
            <span className="text-pink">*</span>
          </label>
          <Input
            required
            id="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="w-full p-2"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block mb-2">
            Confirm Password
            <span className="text-pink">*</span>
          </label>
          <Input
            required
            id="confirm-password"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={(e) =>
              handleInputChange("confirm_password", e.target.value)
            }
            className="w-full p-2"
          />
          {passwordError && (
            <p className="text-red-500 text-sm my-1">{passwordError}</p>
          )}
        </div>

        <div>
          <label htmlFor="username" className="block mb-2">
            Username
            <span className="text-pink">*</span>
          </label>
          <Input
            id="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            className="w-full p-2"
          />
        </div>

        <div>
          <label htmlFor="phone-number" className="block mb-2">
            Phone Number
            <span className="text-pink">*</span>
          </label>
          <Input
            required
            id="phone-number"
            type="text"
            placeholder="+26771234567"
            value={formData.phone_number}
            onChange={(e) => handleInputChange("phone_number", e.target.value)}
            className="w-full p-2"
          />
        </div>

        <div>
          <label htmlFor="id-number" className="block mb-2">
            ID Number
            <span className="text-pink">*</span>
          </label>
          <Input
            required
            id="id-number"
            type="text"
            placeholder="123456789"
            value={formData.id_number}
            onChange={(e) => handleInputChange("id_number", e.target.value)}
            className="w-full p-2"
          />
        </div>

        <Input
          type="submit"
          disabled={isLoading}
          value={isLoading ? "Signing up" : "Signup"}
          className="col-span-1 md:col-span-2 w-full hover:turquoise/40 text-md bg-turquoise text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </form>
    </div>
  );
}
