// ============================================================
// HoliBackground.jsx
// Animated Holi-themed background with:
//  - Scrolling lane track
//  - Floating color powder clouds
//  - Particle rain of color drops
//  - Lane dividers
// ============================================================

import React, { useMemo } from 'react';
import { GAME_CONFIG, HOLI_COLORS } from '../constants/gameConstants';
import './HoliBackground.css';

// Generate static particle data once (no re-render churn)
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  color: HOLI_COLORS[i % HOLI_COLORS.length],
  left:  `${(i * 37 + 5) % 100}%`,
  size:  6 + (i % 5) * 3,
  delay: `${(i * 0.37) % 3}s`,
  duration: `${2.5 + (i % 4) * 0.5}s`,
}));

const CLOUDS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  color: HOLI_COLORS[i % HOLI_COLORS.length],
  top:   `${10 + i * 14}%`,
  delay: `${i * 0.8}s`,
  size:  60 + i * 20,
}));

const HoliBackground = ({ phase, speedMultiplier = 1 }) => {
  const isPlaying = phase === 'playing';

  return (
    <div className="holi-bg">
      {/* ── Sky gradient ──────────────────────────────────── */}
      <div className="holi-bg__sky" />

      {/* ── Floating color clouds ─────────────────────────── */}
      {CLOUDS.map((c) => (
        <div
          key={c.id}
          className="holi-bg__cloud"
          style={{
            top:             c.top,
            width:           `${c.size}px`,
            height:          `${c.size * 0.6}px`,
            background:      c.color,
            animationDelay:  c.delay,
            opacity:         0.18,
          }}
        />
      ))}

      {/* ── Track / road ──────────────────────────────────── */}
      <div className="holi-bg__track">
        {/* Scrolling road lines */}
        <div
          className="holi-bg__road-lines"
          style={{
            animationPlayState: isPlaying ? 'running' : 'paused',
            animationDuration:  `${1.2 / speedMultiplier}s`,
          }}
        />

        {/* Lane dividers */}
        <div className="holi-bg__lane-divider holi-bg__lane-divider--left"  />
        <div className="holi-bg__lane-divider holi-bg__lane-divider--right" />
      </div>

      {/* ── Color powder particles ────────────────────────── */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="holi-bg__particle"
          style={{
            left:              p.left,
            width:             `${p.size}px`,
            height:            `${p.size}px`,
            background:        p.color,
            animationDelay:    p.delay,
            animationDuration: p.duration,
            animationPlayState: isPlaying ? 'running' : 'paused',
          }}
        />
      ))}

      {/* ── Ground strip ──────────────────────────────────── */}
      <div className="holi-bg__ground" />
    </div>
  );
};

export default React.memo(HoliBackground);
