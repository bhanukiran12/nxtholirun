// ============================================================
// GameOver.jsx
// Full-screen overlay shown when the player hits an obstacle.
// Shows final score, high score, new-record badge, and restart.
// ============================================================

import React from 'react';
import { formatScore } from '../utils/gameUtils';
import './GameOver.css';

const HOLI_WISHES = [
  '🌈 May your life be as colorful as Holi!',
  '🎨 Rang Barse — colors of joy on you!',
  '🌸 Bura Na Mano, Holi Hai!',
  '🎉 Wishing you a vibrant & joyful Holi!',
  '💛 May every color bring you happiness!',
];

const GameOver = ({ score, highScore, isNewRecord, onRestart }) => {
  // Pick a random Holi wish each time game over shows
  const wish = HOLI_WISHES[Math.floor(Math.random() * HOLI_WISHES.length)];

  return (
    <div className="gameover">
      {/* Holi color confetti burst */}
      <div className="gameover__confetti" aria-hidden="true">
        {Array.from({ length: 30 }, (_, i) => (
          <span key={i} className="gameover__confetti-piece" style={{ '--i': i }} />
        ))}
      </div>

      <div className="gameover__card">
        {/* Happy Holi banner */}
        <div className="gameover__holi-banner">
          🎊 Happy Holi! 🎊
        </div>

        {/* Title */}
        <div className="gameover__crash-icon">💥</div>
        <h2 className="gameover__title">GAME OVER</h2>
        <p className="gameover__subtitle">A bug caught you! 🐛</p>

        {/* New record badge */}
        {isNewRecord && (
          <div className="gameover__record-badge">
            🏆 NEW HIGH SCORE!
          </div>
        )}

        {/* Scores */}
        <div className="gameover__scores">
          <div className="gameover__score-row">
            <span className="gameover__score-label">Your Score</span>
            <span className="gameover__score-value gameover__score-value--current">
              {formatScore(score)}
            </span>
          </div>
          <div className="gameover__score-row">
            <span className="gameover__score-label">Best Score</span>
            <span className="gameover__score-value gameover__score-value--best">
              {formatScore(highScore)}
            </span>
          </div>
        </div>

        {/* Happy Holi wish */}
        <div className="gameover__holi-wish">
          {wish}
        </div>

        {/* Holi color dots */}
        <div className="gameover__holi-dots" aria-hidden="true">
          {['#FF4081','#FF6D00','#FFEA00','#00E676','#00B0FF','#D500F9'].map((c, i) => (
            <span key={i} className="gameover__holi-dot" style={{ background: c }} />
          ))}
        </div>

        {/* Controls hint */}
        <div className="gameover__controls">
          <div className="gameover__control-row">
            <kbd>←</kbd><kbd>→</kbd>
            <span>Change Lane</span>
          </div>
          <div className="gameover__control-row">
            <kbd>SPACE</kbd>
            <span>Jump</span>
          </div>
        </div>

        {/* Restart button */}
        <button className="gameover__restart-btn" onClick={onRestart}>
          <span className="gameover__restart-icon">🎨</span>
          PLAY AGAIN — HOLI HAI!
        </button>

        <p className="gameover__hint">Press SPACE to restart · Rang Barse! 🌈</p>
      </div>
    </div>
  );
};

export default GameOver;
