// react-frontend/src/BasketballField.jsx
import React from "react";
import "./BasketballField.css";
import fieldImg from "./assets/basketball-field.jpg";
import getPlayerImage from "./getPlayerImage";

/**
 * Renders a 16:9 basketball court with up to five starter cards.
 * The first two players are treated as guards (back‑court),
 * the next two as forwards, and the last as center – purely visual.
 */
export default function BasketballField({ players = [] }) {
  if (!players.length) {
    return (
      <div className="bf-wrapper empty">
        <p>No starters selected.</p>
      </div>
    );
  }

  // Pre‑calculated slots (percentage offsets)
  const slots = [
    { top: "22%", left: "25%" }, // Guard‑1
    { top: "22%", left: "75%" }, // Guard‑2
    { top: "55%", left: "18%" }, // Forward‑1
    { top: "55%", left: "82%" }, // Forward‑2
    { top: "75%", left: "50%" }, // Center
  ];

  return (
    <div
      className="bf-wrapper"
      style={{ backgroundImage: `url(${fieldImg})` }}
    >
      {players.slice(0, 5).map((p, idx) => (
        <div
          key={p.id}
          className="bf-card"
          style={slots[idx] ?? {}}
          title={`${p.firstname} ${p.lastname}`}
        >
          <img
            src={getPlayerImage(p.team)}
            alt={`${p.firstname} ${p.lastname}`}
            className="bf-logo"
          />
          <span className="bf-name">
            {p.firstname} {p.lastname}
          </span>
          <span className="bf-pos">{p.position}</span>
        </div>
      ))}
    </div>
  );
}
