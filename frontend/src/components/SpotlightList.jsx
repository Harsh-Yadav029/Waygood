import React from "react";

export default function SpotlightList({ items }) {
  return (
    <div className="spotlight-grid">
      {items.map((item) => (
        <div key={item.name} className="spotlight-card">
          <div className="spotlight-header">
            <h4>{item.name}</h4>
            <span className="location">{item.country}</span>
          </div>
          <p className="description">{item.summary}</p>
        </div>
      ))}
    </div>
  );
}
