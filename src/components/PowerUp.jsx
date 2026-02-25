// ============================================================
// PowerUp.jsx
// Renders a power-up item on the track.
// Three types: speed_boost, double_score, shield.
// ============================================================

import React from 'react';
import { GAME_CONFIG, POWER_UP_TYPES } from '../constants/gameConstants';
import './PowerUp.css';

const POWERUP_VISUALS = {
  [POWER_UP_TYPES.SPEED_BOOST]: {
    emoji: '⚡',
    label: 'SPEED',
    bg: 'linear-gradient(135deg, #F57F17, #FF6F00)',
    glow: 'rgba(255,160,0,0.8)',
  },
  [POWER_UP_TYPES.DOUBLE_SCORE]: {
    emoji: '✨',
    label: '2×',
    bg: 'linear-gradient(135deg, #880E4F, #AD1457)',
    glow: 'rgba(233,30,99,0.8)',
  },
  [POWER_UP_TYPES.SHIELD]: {
    emoji: '🛡️',
    label: 'SHIELD',
    bg: 'linear-gradient(135deg, #006064, #00838F)',
    glow: 'rgba(0,229,255,0.8)',
  },
};

const PowerUp = ({ powerUp }) => {
  const { x, y, width, height, type } = powerUp;
  const visual = POWERUP_VISUALS[type] || POWERUP_VISUALS[POWER_UP_TYPES.SPEED_BOOST];

  const left = x - width / 2;
  const top  = y - height / 2;

  return (
    <div
      className="powerup"
      style={{
        left:       `${left}px`,
        top:        `${top}px`,
        width:      `${width}px`,
        height:     `${height}px`,
        background: visual.bg,
        boxShadow:  `0 0 18px 6px ${visual.glow}, 0 0 8px 2px ${visual.glow}`,
      }}
    >
      <span className="powerup__emoji">{visual.emoji}</span>
      <span className="powerup__label">{visual.label}</span>
    </div>
  );
};

export default React.memo(PowerUp);
