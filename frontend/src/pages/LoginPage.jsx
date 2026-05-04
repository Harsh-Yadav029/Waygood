import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await api.post("/api/auth/login", { email, password });
      
      // Save credentials correctly from the data wrapper
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Link to="/" className="back-link">← Back to Home</Link>
        <div className="login-header">
          <p className="eyebrow">Waygood Candidate Evaluation</p>
          <h1>Student Portal</h1>
          <p className="subtext">Sign in to view your personalized recommendations and track applications.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="s.ahmed@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="error-box">
              <p>{error}</p>
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <p className="hint" style={{ marginBottom: "24px" }}>
            <strong>Testing Credentials:</strong><br />
            Email: <code>aarav@example.com</code><br />
            Password: <code>Candidate123!</code>
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--muted)", textAlign: "center" }}>
            Don't have an account? <Link to="/register" style={{ color: "var(--accent)", fontWeight: 600 }}>Create one here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
