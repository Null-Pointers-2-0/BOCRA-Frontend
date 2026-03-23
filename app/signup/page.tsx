"use client";

import { useState } from "react";

export default function TestSignup() {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "password" || field === "confirm_password") {
      setPasswordError("");
    }
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    setPasswordError("");
    console.log("Form submitted:", formData);
  };

  const signupExample = [
    {
      first_name: "John",
      last_name: "Smith",
      username: "jsmith",
      email: "user@example.com",
      password: "SecurePass123!",
      confirm_password: "SecurePass123!",
      phone_number: "+26771234567",
      id_number: "123456789",
    },
  ];

  return (
    <div className="min-h-screen w-full py-10 flex flex-col justify-center items-center space-y-5 px-6">
      <h1 className="text-3xl font-bold">Test Signup</h1>
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
          className="col-span-1 md:col-span-2 w-full bg-turquoise text-white py-2"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
