import React from "react";

export default function SignalStrip({ items }) {
  return (
    <div className="signal-strip">
      {items.map((item, i) => (
        <div key={i} className="signal">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}
