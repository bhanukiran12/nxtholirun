// ============================================================
// Obstacle.jsx
// Renders a single obstacle (bug / error block / crash screen).
// Position is driven entirely by the game engine state.
// ============================================================

import React from 'react';
import { GAME_CONFIG } from '../constants/gameConstants';
import './Obstacle.css';

const OBSTACLE_VISUALS = {
  bug: {
    emoji: '🐛',
    label: 'Bug',
    bg: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
    border: '#A5D6A7',
    glow: 'rgba(76,175,80,0.6)',
  },
  error: {
    emoji: '💥',
    label: 'Error',
    bg: 'linear-gradient(135deg, #B71C1C, #C62828)',
    border: '#EF9A9A',
    glow: 'rgba(244,67,54,0.6)',
  },
  crash: {
    emoji: '💻',
    label: 'BSOD',
    bg: 'linear-gradient(135deg, #0D47A1, #1565C0)',
    border: '#90CAF9',
    glow: 'rgba(33,150,243,0.6)',
  },
  virus: {
    emoji: '🦠',
    label: 'Virus',
    bg: 'linear-gradient(135deg, #4A148C, #6A1B9A)',
    border: '#CE93D8',
    glow: 'rgba(156,39,176,0.6)',
  },
};

const Obstacle = ({ obstacle }) => {
  const { x, y, width, height, type } = obstacle;
  const visual = OBSTACLE_VISUALS[type.id] || OBSTACLE_VISUALS.bug;

  const left = x - width / 2;
  const top  = y - height / 2;

  return (
    <div
      className="obstacle"
      style={{
        left:       `${left}px`,
        top:        `${top}px`,
        width:      `${width}px`,
        height:     `${height}px`,
        background: visual.bg,
        border:     `2px solid ${visual.border}`,
        boxShadow:  `0 0 12px ${visual.glow}, inset 0 0 8px rgba(0,0,0,0.3)`,
      }}
    >
      <span className="obstacle__emoji">{visual.emoji}</span>
      <span className="obstacle__label">{visual.label}</span>

      {/* Danger stripes */}
      <div className="obstacle__stripes" />
    </div>
  );
};

export default React.memo(Obstacle);
