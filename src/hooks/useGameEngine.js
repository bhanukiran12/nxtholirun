// ============================================================
// useGameEngine.js
// The heart of the game. Manages all game state via a single
// requestAnimationFrame loop and exposes clean state + actions
// to the Game component.
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  GAME_CONFIG,
  POWER_UP_TYPES,
} from '../constants/gameConstants';
import {
  createObstacle,
  createToken,
  createPowerUp,
  isColliding,
  laneToX,
  saveHighScore,
  getHighScore,
  randomFrom,
} from '../utils/gameUtils';

// ─── Initial state factory ───────────────────────────────────
const makeInitialState = (gameWidth, gameHeight, laneCount) => ({
  phase: 'idle',          // 'idle' | 'playing' | 'gameover'
  score: 0,
  highScore: getHighScore(),
  isNewRecord: false,

  // Player
  playerLane: Math.floor(laneCount / 2),
  playerY: gameHeight - 100,
  isJumping: false,
  jumpProgress: 0,        // 0..1
  isShielded: false,

  // Entities
  obstacles: [],
  tokens: [],
  powerUps: [],

  // Active power-ups
  activePowerUp: null,    // { type, expiresAt }

  // Speed
  speedMultiplier: 1,
});

// ─── Hook ────────────────────────────────────────────────────
export const useGameEngine = (
  gameWidth  = GAME_CONFIG.GAME_WIDTH,
  gameHeight = GAME_CONFIG.GAME_HEIGHT,
  laneCount = GAME_CONFIG.DESKTOP_LANE_COUNT
) => {
  const [state, setState] = useState(() => makeInitialState(gameWidth, gameHeight, laneCount));

  // Refs for mutable values that the RAF loop reads without re-render
  const stateRef         = useRef(state);
  const rafRef           = useRef(null);
  const lastTimeRef      = useRef(null);
  const obstacleTimerRef = useRef(0);
  const tokenTimerRef    = useRef(0);
  const powerUpTimerRef  = useRef(0);
  const jumpTimerRef     = useRef(0);
  const scoreTimerRef    = useRef(0);
  const gameHeightRef    = useRef(gameHeight);
  const gameWidthRef     = useRef(gameWidth);
  const laneCountRef     = useRef(laneCount);

  // Keep refs in sync
  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { gameHeightRef.current = gameHeight; }, [gameHeight]);
  useEffect(() => { gameWidthRef.current  = gameWidth;  }, [gameWidth]);
  useEffect(() => { laneCountRef.current  = laneCount;  }, [laneCount]);
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      playerLane: Math.min(prev.playerLane, laneCount - 1),
    }));
  }, [laneCount]);

  const getPlayerRect = useCallback((s, gh) => {
    const jumpOffset = s.isJumping
      ? Math.sin(s.jumpProgress * Math.PI) * GAME_CONFIG.JUMP_HEIGHT
      : 0;
    return {
      x: laneToX(s.playerLane, gameWidthRef.current, laneCountRef.current),
      y: (gh - 100) - jumpOffset,
      width:  GAME_CONFIG.PLAYER_WIDTH  * 0.85,
      height: GAME_CONFIG.PLAYER_HEIGHT * 0.85,
    };
  }, []);

  // ── Start / Restart ──────────────────────────────────────
  const startGame = useCallback(() => {
    obstacleTimerRef.current = 0;
    tokenTimerRef.current    = 0;
    powerUpTimerRef.current  = 0;
    jumpTimerRef.current     = 0;
    scoreTimerRef.current    = 0;
    lastTimeRef.current      = null;

    const fresh = makeInitialState(gameWidthRef.current, gameHeightRef.current, laneCountRef.current);
    fresh.phase = 'playing';
    setState(fresh);
    stateRef.current = fresh;
  }, []);

  // ── Input handlers ───────────────────────────────────────
  const moveLeft = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'playing') return prev;
      return { ...prev, playerLane: Math.max(0, prev.playerLane - 1) };
    });
  }, []);

  const moveRight = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'playing') return prev;
      return { ...prev, playerLane: Math.min(laneCountRef.current - 1, prev.playerLane + 1) };
    });
  }, []);

  const jump = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'playing' || prev.isJumping) return prev;
      return { ...prev, isJumping: true, jumpProgress: 0 };
    });
  }, []);

  // ── Keyboard listener ────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return;
      switch (e.code) {
        case 'ArrowLeft':  moveLeft();  break;
        case 'ArrowRight': moveRight(); break;
        case 'Space':
          e.preventDefault();
          if (stateRef.current.phase === 'idle' || stateRef.current.phase === 'gameover') {
            startGame();
          } else {
            jump();
          }
          break;
        default: break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [moveLeft, moveRight, jump, startGame]);

  // ── Main game loop ───────────────────────────────────────
  useEffect(() => {
    let animId = null;

    const loop = (timestamp) => {
      if (stateRef.current.phase !== 'playing') {
        animId = requestAnimationFrame(loop);
        return;
      }

      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = Math.min(timestamp - lastTimeRef.current, 50); // cap at 50ms
      lastTimeRef.current = timestamp;

      obstacleTimerRef.current += delta;
      tokenTimerRef.current    += delta;
      powerUpTimerRef.current  += delta;
      scoreTimerRef.current    += delta;

      const gh = gameHeightRef.current;
      const gw = gameWidthRef.current;

      setState((prev) => {
        if (prev.phase !== 'playing') return prev;

        const now = timestamp;
        let next = { ...prev };

        // ── Speed scaling ──────────────────────────────
        const newSpeed = Math.min(
          prev.speedMultiplier + GAME_CONFIG.SPEED_INCREMENT * delta,
          GAME_CONFIG.MAX_SPEED_MULTIPLIER
        );
        next.speedMultiplier = newSpeed;

        const speed = GAME_CONFIG.INITIAL_OBSTACLE_SPEED * newSpeed
          * (prev.activePowerUp?.type === POWER_UP_TYPES.SPEED_BOOST ? 1.6 : 1);

        // ── Score ──────────────────────────────────────
        if (scoreTimerRef.current >= 1000) {
          const multiplier = prev.activePowerUp?.type === POWER_UP_TYPES.DOUBLE_SCORE ? 2 : 1;
          next.score = prev.score + GAME_CONFIG.SCORE_PER_SECOND * multiplier;
          scoreTimerRef.current = 0;
        }

        // ── Jump progress ──────────────────────────────
        if (prev.isJumping) {
          jumpTimerRef.current += delta;
          const progress = jumpTimerRef.current / GAME_CONFIG.JUMP_DURATION;
          if (progress >= 1) {
            next.isJumping     = false;
            next.jumpProgress  = 0;
            jumpTimerRef.current = 0;
          } else {
            next.jumpProgress = progress;
          }
        }

        // ── Spawn obstacles ────────────────────────────
        // Clamp speed divisor so early game doesn't spawn too fast
        const spawnSpeedFactor = Math.min(newSpeed, 1.5);
        let newObstacles = prev.obstacles.map((o) => ({ ...o, y: o.y + speed }));
        if (obstacleTimerRef.current >= GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL / spawnSpeedFactor) {
          newObstacles = [...newObstacles, createObstacle(gw, laneCountRef.current)];
          obstacleTimerRef.current = 0;
        }
        newObstacles = newObstacles.filter((o) => o.y < gh + 100);

        // ── Spawn tokens ───────────────────────────────
        let newTokens = prev.tokens.map((t) => ({ ...t, y: t.y + speed }));
        if (tokenTimerRef.current >= GAME_CONFIG.TOKEN_SPAWN_INTERVAL / spawnSpeedFactor) {
          newTokens = [...newTokens, createToken(gw, laneCountRef.current)];
          tokenTimerRef.current = 0;
        }
        newTokens = newTokens.filter((t) => t.y < gh + 100);

        // ── Spawn power-ups ────────────────────────────
        let newPowerUps = prev.powerUps.map((p) => ({ ...p, y: p.y + speed }));
        if (powerUpTimerRef.current >= GAME_CONFIG.POWERUP_SPAWN_INTERVAL) {
          const types = Object.values(POWER_UP_TYPES);
          newPowerUps = [...newPowerUps, createPowerUp(randomFrom(types), gw, laneCountRef.current)];
          powerUpTimerRef.current = 0;
        }
        newPowerUps = newPowerUps.filter((p) => p.y < gh + 100);

        // ── Expire active power-up ─────────────────────
        let activePowerUp = prev.activePowerUp;
        if (activePowerUp && now >= activePowerUp.expiresAt) {
          activePowerUp = null;
        }
        const isShielded = activePowerUp?.type === POWER_UP_TYPES.SHIELD;

        // ── Collision detection ────────────────────────
        const playerRect = getPlayerRect({ ...next, activePowerUp, isShielded }, gh);

        // Obstacles
        let hitObstacle = false;
        const survivedObstacles = newObstacles.filter((o) => {
          if (next.isJumping) return true; // jumping clears obstacles
          if (isColliding(playerRect, o)) {
            if (isShielded) return false; // shield absorbs hit
            hitObstacle = true;
            return false;
          }
          return true;
        });

        if (hitObstacle) {
          const hs = saveHighScore(Math.floor(prev.score));
          return {
            ...next,
            phase: 'gameover',
            obstacles: survivedObstacles,
            tokens: newTokens,
            powerUps: newPowerUps,
            activePowerUp,
            isShielded,
            highScore: getHighScore(),
            isNewRecord: hs,
          };
        }

        // Tokens
        let scoreGain = 0;
        const remainingTokens = newTokens.filter((t) => {
          if (isColliding(playerRect, t)) {
            const mult = activePowerUp?.type === POWER_UP_TYPES.DOUBLE_SCORE ? 2 : 1;
            scoreGain += GAME_CONFIG.TOKEN_SCORE_VALUE * mult;
            return false;
          }
          return true;
        });

        // Power-ups
        let newActivePowerUp = activePowerUp;
        const remainingPowerUps = newPowerUps.filter((p) => {
          if (isColliding(playerRect, p)) {
            newActivePowerUp = { type: p.type, expiresAt: now + GAME_CONFIG.POWERUP_DURATION };
            return false;
          }
          return true;
        });

        return {
          ...next,
          obstacles:    survivedObstacles,
          tokens:       remainingTokens,
          powerUps:     remainingPowerUps,
          activePowerUp: newActivePowerUp,
          isShielded:   newActivePowerUp?.type === POWER_UP_TYPES.SHIELD,
          score:        next.score + scoreGain,
        };
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    rafRef.current = animId;

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [getPlayerRect]);

  return {
    state,
    actions: { startGame, moveLeft, moveRight, jump },
  };
};
