// auth-frontend/src/App.jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

/**
 * RequireAuth component:
 * - checks for token in localStorage
 * - validates token by calling /api/auth/me
 * - if ok: render children, otherwise redirect to /login
 */
function RequireAuth({ children }) {
  const [checking, setChecking] = React.useState(true);
  const [authed, setAuthed] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    let mounted = true;

    const check = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (mounted) {
          setAuthed(false);
          setChecking(false);
        }
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          // token invalid or expired
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (mounted) {
            setAuthed(false);
            setChecking(false);
          }
          return;
        }

        const data = await res.json();
        // Optionally: refresh stored user
        if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

        if (mounted) {
          setAuthed(true);
          setChecking(false);
        }
      } catch (err) {
        console.error("Auth check failed", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (mounted) {
          setAuthed(false);
          setChecking(false);
        }
      }
    };

    check();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (checking) {
    return <div className="p-6">Checking authentication...</div>;
  }

  if (!authed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * App routes
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
