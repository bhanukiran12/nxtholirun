// ============================================================
// Token.jsx
// Renders a colorful Holi paint-splash token.
// ============================================================

import React from 'react';
import { GAME_CONFIG } from '../constants/gameConstants';
import './Token.css';

const Token = ({ token }) => {
  const { x, y, width, height, color } = token;
  const left = x - width / 2;
  const top  = y - height / 2;

  return (
    <div
      className="token"
      style={{
        left:      `${left}px`,
        top:       `${top}px`,
        width:     `${width}px`,
        height:    `${height}px`,
        background: color,
        boxShadow: `0 0 14px 4px ${color}99, 0 0 6px 2px ${color}`,
      }}
    >
      <span className="token__icon">🎨</span>
    </div>
  );
};

export default React.memo(Token);
