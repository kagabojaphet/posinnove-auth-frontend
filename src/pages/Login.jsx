// auth-frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaEnvelope, FaLock } from "react-icons/fa"; // React icons

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.message || "Login failed.", type: "error" });
        setIsSubmitting(false);
        return;
      }

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      setMessage({
        text: data.message || "Login successful!",
        type: "success",
      });
      navigate("/dashboard");
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
            Please fill in the information below to login to your account.
          </p>
          <ul className="text-sm text-gray-700 space-y-2">
            {[
              "Log in with your email.",
              "Keep your password safe.",
              "Access your account.",
            ].map((text, idx) => (
              <li key={idx} className="flex items-center">
                <FaCheck className="text-blue-600 mr-2" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section - Form */}
        <div
          className="w-full md:w-1/2 p-6 text-white"
          style={{ background: "#3F51B5" }}
        >
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              className={`w-full py-2 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-white text-indigo-600 hover:bg-gray-200"
              } font-semibold rounded-md shadow-md text-sm transition-colors`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
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
            Don't have an account?{" "}
            <button
              className="text-white font-semibold underline bg-transparent cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
