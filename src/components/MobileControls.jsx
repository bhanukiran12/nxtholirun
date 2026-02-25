// ============================================================
// MobileControls.jsx
// On-screen touch buttons for mobile players.
// Shown only on touch devices (CSS media query hides on desktop).
// ============================================================

import React from 'react';
import './MobileControls.css';

const MobileControls = ({ onLeft, onRight, onJump }) => (
  <div className="mobile-controls">
    <button
      className="mobile-controls__btn mobile-controls__btn--left"
      onTouchStart={(e) => { e.preventDefault(); onLeft(); }}
      onClick={onLeft}
      aria-label="Move Left"
    >
      ◀
    </button>

    <button
      className="mobile-controls__btn mobile-controls__btn--jump"
      onTouchStart={(e) => { e.preventDefault(); onJump(); }}
      onClick={onJump}
      aria-label="Jump"
    >
      ▲ JUMP
    </button>

    <button
      className="mobile-controls__btn mobile-controls__btn--right"
      onTouchStart={(e) => { e.preventDefault(); onRight(); }}
      onClick={onRight}
      aria-label="Move Right"
    >
      ▶
    </button>
  </div>
);

export default React.memo(MobileControls);
