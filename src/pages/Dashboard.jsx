// auth-frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchMe = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // no token -> redirect to login
        navigate("/login", { replace: true });
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // token invalid / expired
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (mounted) navigate("/login", { replace: true });
          return;
        }

        const data = await res.json();
        if (mounted) {
          setUser(
            data.user || JSON.parse(localStorage.getItem("user") || "null")
          );
          // ensure user stored locally is up-to-date
          if (data.user)
            localStorage.setItem("user", JSON.stringify(data.user));
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        if (mounted) {
          setError("Failed to load dashboard. Please try again.");
          setLoading(false);
        }
      }
    };

    fetchMe();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>

        <p className="text-gray-700 mb-6">
          {error || "You're successfully logged in!"}
        </p>

        <div className="mb-4 text-sm text-gray-600">
          <div>
            <strong>Email:</strong> {user?.email || "—"}
          </div>
          <div>
            <strong>User ID:</strong> {user?.id || user?._id || "—"}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
