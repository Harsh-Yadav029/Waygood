import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import InfoCard from "./components/InfoCard.jsx";
import SignalStrip from "./components/SignalStrip.jsx";
import SpotlightList from "./components/SpotlightList.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProgramFinder from "./pages/ProgramFinder.jsx";
import {
  assignmentSignals,
  featureCards,
  productSignals,
  universitySpotlights,
} from "./data/sampleData.js";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function Navbar() {
  const token = localStorage.getItem("token");
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo">Waygood</Link>
        <div className="nav-links">
          {token ? (
            <>
              <Link to="/programs">Explore Programs</Link>
              <Link to="/dashboard" className="nav-portal-btn">My Dashboard</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="nav-portal-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Waygood Candidate Evaluation Starter</p>
            <h1>Build the backend for a study-abroad platform that feels real.</h1>
            <p className="hero-text">
              This starter is shaped around student discovery, counselor workflows,
              and practical backend engineering. Candidates can extend the
              experience with stronger APIs, recommendations, caching, and better
              application lifecycle management.
            </p>
            <div className="hero-actions">
              <Link to="/programs" className="cta-button primary">
                Browse Programs
              </Link>
              <Link to="/register" className="cta-button secondary">
                Get Started
              </Link>
            </div>
          </div>
          <div className="hero-panel">
            <p className="panel-label">Starter outcomes</p>
            <ul>
              {assignmentSignals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </div>
        </section>

        <SignalStrip items={productSignals} />

        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Product direction</p>
            <h2>Waygood-style platform areas</h2>
          </div>
          <div className="card-grid">
            {featureCards.map((card) => (
              <InfoCard key={card.title} title={card.title} body={card.body} />
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Global Reach</p>
            <h2>Featured Universities</h2>
          </div>
          <SpotlightList items={universitySpotlights} />
        </section>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/programs" 
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <ProgramFinder />
              </>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
