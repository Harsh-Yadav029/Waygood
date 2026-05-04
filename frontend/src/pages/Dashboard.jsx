import React, { useEffect, useState } from "react";
import api from "../api/axios";
import SignalStrip from "../components/SignalStrip";

export default function Dashboard() {
  const [recommendations, setRecommendations] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    const fetchRecommendations = async () => {
      try {
        const res = await api.get("/api/recommendations");
        setRecommendations(res.data.data);
      } catch (err) {
        console.error("Error fetching recommendations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <div className="loading">Loading your matches...</div>;

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div className="user-welcome">
          <p className="eyebrow">Student Dashboard</p>
          <h1>Hello, {user?.fullName || "Student"}!</h1>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} className="logout-btn">
          Logout
        </button>
      </header>

      <section className="dashboard-section">
        <div className="section-heading">
          <p className="eyebrow">Smart Matches</p>
          <h2>Top Program Recommendations for You</h2>
          <p>Based on your profile, budget, and field of interest.</p>
        </div>

        <div className="recommendations-grid">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <div key={rec._id} className="recommendation-card ai-powered">
                <div className="ai-badge">
                  AI Smart Match
                </div>
                <div className="rec-score">
                  <span className="score-label">Match Confidence</span>
                  <span className="score-value">{((rec.matchScore / 5) * 100).toFixed(0)}%</span>
                </div>
                <h3 style={{ fontSize: "1.2rem", margin: "12px 0 4px" }}>{rec.title}</h3>
                <p className="university-name" style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.9rem" }}>{rec.university.name}</p>
                
                <div className="match-reasons">
                  {rec.matchReasons.map((reason, i) => (
                    <span key={i} className="reason-tag">{reason}</span>
                  ))}
                </div>

                <div className="rec-footer">
                  <span className="fee">Fee: ${rec.tuitionFee}</span>
                  <button className="apply-btn">Apply Now</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">No specific matches found. Try updating your profile!</div>
          )}
        </div>
      </section>
    </main>
  );
}
