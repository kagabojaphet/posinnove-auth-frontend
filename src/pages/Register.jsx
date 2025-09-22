// frontend/src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          text: data.message || "Registration failed.",
          type: "error",
        });
        setIsSubmitting(false);
        return;
      }

      setMessage({
        text:
          data.message || "Registration successful! Redirecting to login...",
        type: "success",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Network error:", err);
      setMessage({ text: "Network error. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-2xl flex flex-col md:flex-row">
        {/* Left Section - Instructions */}
        <div className="w-full md:w-1/2 p-6 flex flex-col items-start text-left">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            General Instruction
          </h2>
          <p className="text-sm text-gray-700 mb-4">
            Fill out the form below to create your account. Use a strong
            password to keep your account secure.
          </p>
          <ul className="text-sm text-gray-700 space-y-2">
            {[
              "Create an account using your email.",
              "Use a strong and secure password (at least 8 characters).",
              'Click "Register" to submit your information.',
            ].map((text, idx) => (
              <li key={idx} className="flex items-center">
                <FaCheck className="text-blue-600 mr-2" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section - Registration Form */}
        <div
          className="w-full md:w-1/2 p-6 text-white"
          style={{ background: "#3F51B5" }}
        >
          <h2 className="text-2xl font-bold mb-4">Registration Form</h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div className="relative">
              <label htmlFor="name" className="block text-xs font-medium mb-1">
                Full Name
              </label>
              <div className="flex items-center">
                <FaUser className="absolute ml-2 text-white text-sm" />
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-7 pr-3 py-2 rounded-md bg-[#5A67D8] placeholder-white text-white text-sm focus:outline-none focus:ring-1 focus:ring-white ${
                    errors.name
                      ? "border border-red-400"
                      : "border border-[#5A67D8]"
                  }`}
                  placeholder="Your full name"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
              </div>
              {errors.name && (
                <p id="name-error" className="text-red-300 text-xs mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <label htmlFor="email" className="block text-xs font-medium mb-1">
                Email Address
              </label>
              <div className="flex items-center">
                <FaEnvelope className="absolute ml-2 text-white text-sm" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-7 pr-3 py-2 rounded-md bg-[#5A67D8] placeholder-white text-white text-sm focus:outline-none focus:ring-1 focus:ring-white ${
                    errors.email
                      ? "border border-red-400"
                      : "border border-[#5A67D8]"
                  }`}
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-red-300 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-xs font-medium mb-1"
              >
                Password
              </label>
              <div className="flex items-center">
                <FaLock className="absolute ml-2 text-white text-sm" />
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-7 pr-3 py-2 rounded-md bg-[#5A67D8] placeholder-white text-white text-sm focus:outline-none focus:ring-1 focus:ring-white ${
                    errors.password
                      ? "border border-red-400"
                      : "border border-[#5A67D8]"
                  }`}
                  placeholder="Your secure password"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
              </div>
              {errors.password && (
                <p id="password-error" className="text-red-300 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full py-2 font-semibold rounded-md shadow-md text-sm transition-colors ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-white text-indigo-600 hover:bg-gray-200"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>

          {message.text && (
            <p
              className={`mt-4 text-center text-sm ${
                message.type === "success" ? "text-green-300" : "text-red-300"
              }`}
            >
              {message.text}
            </p>
          )}

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-white font-semibold underline bg-transparent cursor-pointer"
            >
              Log in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
