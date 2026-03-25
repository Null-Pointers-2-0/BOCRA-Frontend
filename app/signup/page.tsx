"use client";

import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "password" || field === "confirm_password") {
      setPasswordError("");
    }

    if (submitError) setSubmitError("");
    if (submitSuccess) setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");
    setSubmitError("");
    setIsLoading(true);

    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        phone_number: formData.phone_number,
        id_number: formData.id_number,
      };

      console.log("Sending payload:", payload);

      const response = await fetch(
        "https://bocra-backend.mooo.com/api/v1/accounts/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        throw new Error(
          errorData.message ||
            errorData.detail ||
            `HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("Signup successful:", data);
      setSubmitSuccess(true);

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
            Your account has been created. You can now log in.
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
        className="w-full grid grid-cols-1 md:grid-cols-2 max-w-2xl p-4 bg-gray-50 gap-4 border border-gray-500"
      >
        <div>
          <label htmlFor="first-name" className="block mb-2">
            First Name
            <span className="text-pink">*</span>
          </label>
          <input
            id="first-name"
            type="text"
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
            className="w-full p-2 border border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="last-name" className="block mb-2">
            Last Name
            <span className="text-pink">*</span>
          </label>
          <input
            id="last-name"
            type="text"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
            className="w-full p-2 border border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-2">
            Email
            <span className="text-pink">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full p-2 border border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2">
            Password
            <span className="text-pink">*</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="w-full p-2 border border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block mb-2">
            Confirm Password
            <span className="text-pink">*</span>
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={(e) =>
              handleInputChange("confirm_password", e.target.value)
            }
            className="w-full p-2 border border-gray-400"
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
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            className="w-full p-2 border border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="phone-number" className="block mb-2">
            Phone Number
            <span className="text-pink">*</span>
          </label>
          <input
            id="phone-number"
            type="text"
            placeholder="+26771234567"
            value={formData.phone_number}
            onChange={(e) => handleInputChange("phone_number", e.target.value)}
            className="w-full p-2 border border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="id-number" className="block mb-2">
            ID Number
            <span className="text-pink">*</span>
          </label>
          <input
            id="id-number"
            type="text"
            placeholder="123456789"
            value={formData.id_number}
            onChange={(e) => handleInputChange("id_number", e.target.value)}
            className="w-full p-2 border border-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="col-span-1 md:col-span-2 w-full bg-turquoise text-white py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
    </div>
  );
}
