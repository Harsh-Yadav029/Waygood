import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function ProgramFinder() {
  const [programs, setPrograms] = useState([]);
  const [filters, setFilters] = useState({
    country: "",
    fieldOfStudy: "",
    maxTuition: "",
    page: 1,
    limit: 6
  });
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (!params.country) delete params.country;
      if (!params.fieldOfStudy) delete params.fieldOfStudy;
      if (!params.maxTuition) delete params.maxTuition;

      const res = await api.get("/programs", { params });
      setPrograms(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error("Error fetching programs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [filters.page, filters.country, filters.fieldOfStudy, filters.maxTuition]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const [selectedProgram, setSelectedProgram] = useState(null);

  return (
    <div className="page-shell">
      <header className="discovery-header">
        <p className="eyebrow">Program Discovery</p>
        <h1>Find Your Perfect Program</h1>
        
        <div className="filter-bar">
          <div className="filter-group">
            <label>Country</label>
            <select name="country" value={filters.country} onChange={handleFilterChange}>
              <option value="">All Countries</option>
              <option value="Canada">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="UAE">UAE</option>
              <option value="USA">USA</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Field of Study</label>
            <select name="fieldOfStudy" value={filters.fieldOfStudy} onChange={handleFilterChange}>
              <option value="">All Fields</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Engineering">Engineering</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Max Tuition ($)</label>
            <input 
              type="number" 
              name="maxTuition" 
              placeholder="e.g. 30000"
              value={filters.maxTuition} 
              onChange={handleFilterChange} 
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="loading-grid">Loading programs...</div>
      ) : (
        <>
          <div className="program-results-grid">
            {programs.map((program) => (
              <div key={program._id} className="program-card">
                <div className="program-tag">{program.degreeLevel}</div>
                <h3>{program.title}</h3>
                <p className="uni-name">{program.universityName || program.university?.name}</p>
                <div className="program-details">
                  <span className="detail-item">{program.city}, {program.country}</span>
                  <span className="detail-item">${program.tuitionFee.toLocaleString()}</span>
                </div>
                <button 
                  className="view-details-btn" 
                  onClick={() => setSelectedProgram(program)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* Pagination component logic stays same */}
        </>
      )}

      {/* --- Premium Program Modal --- */}
      {selectedProgram && (
        <div className="modal-overlay" onClick={() => setSelectedProgram(null)}>
          <div className="program-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedProgram(null)}>×</button>
            <div className="modal-header">
              <span className="modal-tag">{selectedProgram.degreeLevel}</span>
              <h2>{selectedProgram.title}</h2>
              <p className="modal-uni">{selectedProgram.universityName}</p>
            </div>
            
            <div className="modal-body">
              <div className="info-grid">
                <div className="info-item">
                  <label>Location</label>
                  <span>{selectedProgram.city}, {selectedProgram.country}</span>
                </div>
                <div className="info-item">
                  <label>Annual Tuition</label>
                  <span>${selectedProgram.tuitionFee.toLocaleString()} USD</span>
                </div>
                <div className="info-item">
                  <label>IELTS Requirement</label>
                  <span>{selectedProgram.ieltsRequirement || "No Score Required"}</span>
                </div>
                <div className="info-item">
                  <label>Scholarship</label>
                  <span>{selectedProgram.scholarshipAvailable ? "Available" : "Not Available"}</span>
                </div>
              </div>

              <div className="university-prestige">
                <div className="ranking-badge">
                  QS Ranking: #{selectedProgram.university?.qsRanking || "Top Tier"}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={() => setSelectedProgram(null)}>Close</button>
              <button className="primary-btn" onClick={() => alert("Application process started!")}>Apply Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
