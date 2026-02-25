// ============================================================
// Player.jsx
// Renders the player avatar (young coder) in the correct lane.
// Handles jump animation via CSS transform.
// Shows shield glow when shielded.
// ============================================================

import React from 'react';
import { GAME_CONFIG } from '../constants/gameConstants';
import { laneToX } from '../utils/gameUtils';
import './Player.css';

const Player = ({ playerLane, isJumping, jumpProgress, isShielded, gameWidth, gameHeight, laneCount }) => {
  const centerX = laneToX(playerLane, gameWidth, laneCount);
  const baseY   = (gameHeight || GAME_CONFIG.GAME_HEIGHT) - 100;

  // Parabolic jump offset
  const jumpOffset = isJumping
    ? Math.sin(jumpProgress * Math.PI) * GAME_CONFIG.JUMP_HEIGHT
    : 0;

  const left = centerX - GAME_CONFIG.PLAYER_WIDTH / 2;
  const top  = baseY - GAME_CONFIG.PLAYER_HEIGHT / 2 - jumpOffset;

  return (
    <div
      className={`player ${isJumping ? 'player--jumping' : ''} ${isShielded ? 'player--shielded' : ''}`}
      style={{
        left: `${left}px`,
        top:  `${top}px`,
        width:  `${GAME_CONFIG.PLAYER_WIDTH}px`,
        height: `${GAME_CONFIG.PLAYER_HEIGHT}px`,
        transition: isJumping ? 'none' : 'left 0.12s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
    >
      {/* Avatar body */}
      <div className="player__body">
        {/* Head */}
        <div className="player__head">
          <div className="player__face">
            <span className="player__eyes">👀</span>
          </div>
          {/* Holi color splash on head */}
          <div className="player__head-splash" />
        </div>

        {/* Torso with hoodie */}
        <div className="player__torso">
          <span className="player__code-icon">{'</>'}</span>
        </div>

        {/* Legs */}
        <div className="player__legs">
          <div className={`player__leg player__leg--left  ${isJumping ? 'player__leg--up' : ''}`} />
          <div className={`player__leg player__leg--right ${isJumping ? 'player__leg--up' : ''}`} />
        </div>
      </div>

      {/* Shield bubble */}
      {isShielded && <div className="player__shield" />}

      {/* Holi color trail */}
      <div className="player__trail" />
    </div>
  );
};

export default React.memo(Player);
