import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/api/auth/register", formData);
      // Registration success - redirect to login
      navigate("/login", { state: { message: "Account created successfully! Please login." } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Link to="/" className="back-link">← Back</Link>
        <div className="login-header">
          <p className="eyebrow">Join Waygood</p>
          <h1>Create Account</h1>
          <p className="subtext">Start your study-abroad journey with a personalized roadmap.</p>
        </div>

        <form onSubmit={handleRegister} className="login-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g. Jane Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="jane@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Min. 8 chars with a number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">I am a...</label>
            <select id="role" name="role" value={formData.role} onChange={handleInputChange}>
              <option value="student">Student</option>
              <option value="counselor">Counselor</option>
            </select>
          </div>

          {error && (
            <div className="error-box">
              <p>{error}</p>
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Creating Account..." : "Register Now"}
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: "24px", textAlign: "center" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
            Already have an account? <Link to="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
