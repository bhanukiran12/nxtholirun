// ============================================================
// StartScreen.jsx
// Splash / title screen shown before the game starts.
// ============================================================

import React from 'react';
import { formatScore } from '../utils/gameUtils';
import './StartScreen.css';

const HOLI_GREETINGS = [
  '🌈 Happy Holi! 🌈',
  '🎨 Rang Barse! 🎨',
  '🌸 Bura Na Mano, Holi Hai! 🌸',
  '🎉 Holi Mubarak! 🎉',
];

const StartScreen = ({ highScore, onStart }) => (
  <div className="start-screen">
    {/* Holi color burst rings */}
    <div className="start-screen__rings" aria-hidden="true">
      {[0,1,2,3].map((i) => (
        <div key={i} className="start-screen__ring" style={{ '--i': i }} />
      ))}
    </div>

    {/* Floating Holi greeting */}
    <div className="start-screen__holi-banner" aria-hidden="true">
      {HOLI_GREETINGS.map((msg, i) => (
        <span key={i} className="start-screen__holi-word" style={{ '--j': i }}>{msg}</span>
      ))}
    </div>

    <div className="start-screen__content">
      {/* Happy Holi headline */}
      <div className="start-screen__happy-holi">🎊 Happy Holi! 🎊</div>

      {/* Logo */}
      <div className="start-screen__logo">
        <span className="start-screen__logo-icon">🎨</span>
        <div className="start-screen__logo-text">
          <span className="start-screen__logo-nxt">NXT</span>
          <span className="start-screen__logo-holi">HOLI</span>
          <span className="start-screen__logo-run">RUN</span>
        </div>
      </div>

      {/* Tagline */}
      <p className="start-screen__tagline">
        Dodge the bugs · Collect the colors · Spread the joy!
      </p>

      {/* High score */}
      {highScore > 0 && (
        <div className="start-screen__highscore">
          <span>🏆 Best: </span>
          <span className="start-screen__highscore-val">{formatScore(highScore)}</span>
        </div>
      )}

      {/* Controls */}
      <div className="start-screen__controls">
        <div className="start-screen__control">
          <div className="start-screen__keys">
            <kbd>←</kbd><kbd>→</kbd>
          </div>
          <span>Change Lane</span>
        </div>
        <div className="start-screen__control">
          <kbd className="start-screen__key-space">SPACE</kbd>
          <span>Jump / Start</span>
        </div>
      </div>

      {/* Power-up legend */}
      <div className="start-screen__powerups">
        <div className="start-screen__powerup-item">
          <span>⚡</span><span>Speed Boost</span>
        </div>
        <div className="start-screen__powerup-item">
          <span>✨</span><span>2× Score</span>
        </div>
        <div className="start-screen__powerup-item">
          <span>🛡️</span><span>Shield</span>
        </div>
      </div>

      {/* Start button */}
      <button className="start-screen__btn" onClick={onStart}>
        <span>🎨</span> PLAY HOLI RUN!
      </button>

      <p className="start-screen__hint">or press SPACE · Rang Barse! 🌈</p>
    </div>
  </div>
);

export default StartScreen;
