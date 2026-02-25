// ============================================================
// gameUtils.js
// Pure utility functions used across the game.
// No side effects – easy to unit-test.
// ============================================================

import { GAME_CONFIG, OBSTACLE_TYPES, TOKEN_COLORS } from '../constants/gameConstants';

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 */
export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Picks a random element from an array.
 */
export const randomFrom = (arr) => arr[randomInt(0, arr.length - 1)];

/**
 * Generates a unique id string.
 */
export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/**
 * Returns the X pixel position (center) for a given lane index.
 * @param {number} laneIndex
 * @param {number} gameWidth
 * @param {number} laneCount
 */
export const laneToX = (
  laneIndex,
  gameWidth = GAME_CONFIG.GAME_WIDTH,
  laneCount = GAME_CONFIG.DESKTOP_LANE_COUNT
) => {
  const safeLaneCount = Math.max(1, laneCount);
  const clampedLane = Math.min(Math.max(0, laneIndex), safeLaneCount - 1);
  return ((clampedLane + 0.5) / safeLaneCount) * gameWidth;
};

/**
 * Creates a new obstacle object.
 * @param {number} gameWidth
 * @param {number} laneCount
 */
export const createObstacle = (
  gameWidth = GAME_CONFIG.GAME_WIDTH,
  laneCount = GAME_CONFIG.DESKTOP_LANE_COUNT
) => {
  const laneIndex = randomInt(0, laneCount - 1);
  const type = randomFrom(OBSTACLE_TYPES);
  return {
    id: uid(),
    laneIndex,
    x: laneToX(laneIndex, gameWidth, laneCount),
    y: -GAME_CONFIG.OBSTACLE_HEIGHT,
    width: GAME_CONFIG.OBSTACLE_WIDTH,
    height: GAME_CONFIG.OBSTACLE_HEIGHT,
    type,
  };
};

/**
 * Creates a new token (paint splash) object.
 * @param {number} gameWidth
 * @param {number} laneCount
 */
export const createToken = (
  gameWidth = GAME_CONFIG.GAME_WIDTH,
  laneCount = GAME_CONFIG.DESKTOP_LANE_COUNT
) => {
  const laneIndex = randomInt(0, laneCount - 1);
  return {
    id: uid(),
    laneIndex,
    x: laneToX(laneIndex, gameWidth, laneCount),
    y: -GAME_CONFIG.TOKEN_HEIGHT,
    width: GAME_CONFIG.TOKEN_WIDTH,
    height: GAME_CONFIG.TOKEN_HEIGHT,
    color: randomFrom(TOKEN_COLORS),
  };
};

/**
 * Creates a new power-up object.
 * @param {string} type  – one of POWER_UP_TYPES values
 * @param {number} gameWidth
 * @param {number} laneCount
 */
export const createPowerUp = (
  type,
  gameWidth = GAME_CONFIG.GAME_WIDTH,
  laneCount = GAME_CONFIG.DESKTOP_LANE_COUNT
) => {
  const laneIndex = randomInt(0, laneCount - 1);
  return {
    id: uid(),
    laneIndex,
    x: laneToX(laneIndex, gameWidth, laneCount),
    y: -GAME_CONFIG.POWERUP_HEIGHT,
    width: GAME_CONFIG.POWERUP_WIDTH,
    height: GAME_CONFIG.POWERUP_HEIGHT,
    type,
  };
};

/**
 * AABB collision detection.
 * Both objects need { x, y, width, height } where x,y is the CENTER.
 */
export const isColliding = (a, b) => {
  const aLeft   = a.x - a.width  / 2;
  const aRight  = a.x + a.width  / 2;
  const aTop    = a.y - a.height / 2;
  const aBottom = a.y + a.height / 2;

  const bLeft   = b.x - b.width  / 2;
  const bRight  = b.x + b.width  / 2;
  const bTop    = b.y - b.height / 2;
  const bBottom = b.y + b.height / 2;

  // Add a small tolerance (shrink hitbox by 40%) for fairness
  const tolerance = 0.40;
  const aw = (aRight - aLeft) * (1 - tolerance);
  const ah = (aBottom - aTop) * (1 - tolerance);
  const bw = (bRight - bLeft) * (1 - tolerance);
  const bh = (bBottom - bTop) * (1 - tolerance);

  const aCx = (aLeft + aRight) / 2;
  const aCy = (aTop + aBottom) / 2;
  const bCx = (bLeft + bRight) / 2;
  const bCy = (bTop + bBottom) / 2;

  return (
    Math.abs(aCx - bCx) < (aw + bw) / 2 &&
    Math.abs(aCy - bCy) < (ah + bh) / 2
  );
};

/**
 * Reads the high score from localStorage.
 */
export const getHighScore = () => {
  try {
    return parseInt(localStorage.getItem('nxtholi_highscore') || '0', 10);
  } catch {
    return 0;
  }
};

/**
 * Saves the high score to localStorage.
 * @param {number} score
 */
export const saveHighScore = (score) => {
  try {
    const current = getHighScore();
    if (score > current) {
      localStorage.setItem('nxtholi_highscore', String(score));
      return true; // new record
    }
  } catch {
    // ignore storage errors
  }
  return false;
};

/**
 * Formats a numeric score with leading zeros (6 digits).
 * @param {number} score
 */
export const formatScore = (score) => String(Math.floor(score)).padStart(6, '0');
