// ============================================================
// HUD.jsx
// Heads-Up Display: score, high score, active power-up timer.
// ============================================================

import React from 'react';
import { POWER_UP_TYPES, GAME_CONFIG } from '../constants/gameConstants';
import { formatScore } from '../utils/gameUtils';
import './HUD.css';

const POWERUP_INFO = {
  [POWER_UP_TYPES.SPEED_BOOST]:  { emoji: '⚡', label: 'Speed Boost', color: '#FF6F00' },
  [POWER_UP_TYPES.DOUBLE_SCORE]: { emoji: '✨', label: '2× Score',    color: '#E91E63' },
  [POWER_UP_TYPES.SHIELD]:       { emoji: '🛡️', label: 'Shield',      color: '#00E5FF' },
};

const HUD = ({ score, highScore, activePowerUp, speedMultiplier }) => {
  const powerInfo = activePowerUp ? POWERUP_INFO[activePowerUp.type] : null;

  // Calculate remaining time for active power-up
  const remaining = activePowerUp
    ? Math.max(0, Math.ceil((activePowerUp.expiresAt - Date.now()) / 1000))
    : 0;

  const progress = activePowerUp
    ? Math.max(0, (activePowerUp.expiresAt - Date.now()) / GAME_CONFIG.POWERUP_DURATION)
    : 0;

  return (
    <div className="hud">
      {/* ── Score ─────────────────────────────────────────── */}
      <div className="hud__score-block">
        <div className="hud__label">SCORE</div>
        <div className="hud__score">{formatScore(score)}</div>
      </div>

      {/* ── Happy Holi ticker ─────────────────────────────── */}
      <div className="hud__holi-ticker" aria-hidden="true">
        🎨 Happy Holi! 🌈 Rang Barse! 🎉 Holi Mubarak! 🌸
      </div>

      {/* ── Active power-up ───────────────────────────────── */}
      {powerInfo && (
        <div
          className="hud__powerup"
          style={{ borderColor: powerInfo.color, boxShadow: `0 0 10px ${powerInfo.color}66` }}
        >
          <span className="hud__powerup-emoji">{powerInfo.emoji}</span>
          <div className="hud__powerup-info">
            <span className="hud__powerup-label" style={{ color: powerInfo.color }}>
              {powerInfo.label}
            </span>
            <div className="hud__powerup-bar-bg">
              <div
                className="hud__powerup-bar-fill"
                style={{
                  width:      `${progress * 100}%`,
                  background: powerInfo.color,
                }}
              />
            </div>
            <span className="hud__powerup-time">{remaining}s</span>
          </div>
        </div>
      )}

      {/* ── High score ────────────────────────────────────── */}
      <div className="hud__score-block hud__score-block--right">
        <div className="hud__label">BEST</div>
        <div className="hud__score hud__score--best">{formatScore(highScore)}</div>
      </div>

      {/* ── Speed indicator ───────────────────────────────── */}
      <div className="hud__speed">
        <span className="hud__speed-icon">🏃</span>
        <span className="hud__speed-val">×{speedMultiplier.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default React.memo(HUD);
