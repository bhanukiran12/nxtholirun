// ============================================================
// Game.jsx
// Root game component. Owns the game canvas area and composes
// all sub-components. Reads state from useGameEngine hook.
// ============================================================

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGameEngine }    from '../hooks/useGameEngine';
import { GAME_CONFIG }      from '../constants/gameConstants';
import HoliBackground       from './HoliBackground';
import Player               from './Player';
import Obstacle             from './Obstacle';
import Token                from './Token';
import PowerUp              from './PowerUp';
import HUD                  from './HUD';
import GameOver             from './GameOver';
import StartScreen          from './StartScreen';
import MobileControls       from './MobileControls';
import './Game.css';

const Game = () => {
  const containerRef = useRef(null);

  // Responsive: track actual rendered width so lane positions scale
  const [gameWidth, setGameWidth] = useState(GAME_CONFIG.GAME_WIDTH);
  const [gameHeight, setGameHeight] = useState(GAME_CONFIG.GAME_HEIGHT);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        const h = window.visualViewport?.height || window.innerHeight;
        setGameWidth(w);
        setGameHeight(h);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const laneCount = gameWidth < GAME_CONFIG.LANE_BREAKPOINT
    ? GAME_CONFIG.MOBILE_LANE_COUNT
    : GAME_CONFIG.DESKTOP_LANE_COUNT;

  const { state, actions } = useGameEngine(gameWidth, gameHeight, laneCount);
  const { phase, score, highScore, isNewRecord,
          playerLane, isJumping, jumpProgress, isShielded,
          obstacles, tokens, powerUps, activePowerUp,
          speedMultiplier } = state;

  const handleRestart = useCallback(() => actions.startGame(), [actions]);

  return (
    <div className="game-wrapper">
      <div
        ref={containerRef}
        className="game-canvas"
        style={{ height: `${gameHeight}px` }}
      >
        {/* ── Background ──────────────────────────────────── */}
        <HoliBackground phase={phase} speedMultiplier={speedMultiplier} />

        {/* ── Play columns / lanes ───────────────────────── */}
        <div
          className="game-lanes"
          aria-hidden="true"
          style={{ '--lane-count': laneCount }}
        >
          {Array.from({ length: laneCount }).map((_, index) => (
            <div key={index} className="game-lane" />
          ))}
        </div>

        {/* ── HUD (always visible during play) ────────────── */}
        {(phase === 'playing' || phase === 'gameover') && (
          <HUD
            score={score}
            highScore={highScore}
            activePowerUp={activePowerUp}
            speedMultiplier={speedMultiplier}
          />
        )}

        {/* ── Tokens ──────────────────────────────────────── */}
        {tokens.map((t) => (
          <Token key={t.id} token={t} />
        ))}

        {/* ── Power-ups ───────────────────────────────────── */}
        {powerUps.map((p) => (
          <PowerUp key={p.id} powerUp={p} />
        ))}

        {/* ── Obstacles ───────────────────────────────────── */}
        {obstacles.map((o) => (
          <Obstacle key={o.id} obstacle={o} />
        ))}

        {/* ── Player ──────────────────────────────────────── */}
        {phase !== 'idle' && (
          <Player
            playerLane={playerLane}
            isJumping={isJumping}
            jumpProgress={jumpProgress}
            isShielded={isShielded}
            gameWidth={gameWidth}
            gameHeight={gameHeight}
            laneCount={laneCount}
          />
        )}

        {/* ── Mobile controls ─────────────────────────────── */}
        {phase === 'playing' && (
          <MobileControls
            onLeft={actions.moveLeft}
            onRight={actions.moveRight}
            onJump={actions.jump}
          />
        )}

        {/* ── Overlays ────────────────────────────────────── */}
        {phase === 'idle' && (
          <StartScreen
            highScore={highScore}
            onStart={handleRestart}
          />
        )}

        {phase === 'gameover' && (
          <GameOver
            score={score}
            highScore={highScore}
            isNewRecord={isNewRecord}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
};

export default Game;
