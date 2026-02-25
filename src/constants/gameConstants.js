// ============================================================
// gameConstants.js
// Central configuration for all game parameters.
// Changing values here affects the entire game balance.
// ============================================================

export const GAME_CONFIG = {
  // Responsive lane setup
  MOBILE_LANE_COUNT: 4,
  DESKTOP_LANE_COUNT: 6,
  LANE_BREAKPOINT: 768,

  // Player settings
  PLAYER_WIDTH: 60,
  PLAYER_HEIGHT: 80,
  JUMP_DURATION: 700,       // ms – slightly longer jump window
  JUMP_HEIGHT: 130,         // px – higher jump for easier obstacle clearing

  // Obstacle settings
  OBSTACLE_WIDTH: 54,
  OBSTACLE_HEIGHT: 64,
  INITIAL_OBSTACLE_SPEED: 2.5,   // px per frame – gentler start
  OBSTACLE_SPAWN_INTERVAL: 3200, // ms – more breathing room between obstacles

  // Token settings
  TOKEN_WIDTH: 38,
  TOKEN_HEIGHT: 38,
  TOKEN_SPAWN_INTERVAL: 1200, // ms – more tokens to collect
  TOKEN_SCORE_VALUE: 10,

  // Power-up settings
  POWERUP_WIDTH: 46,
  POWERUP_HEIGHT: 46,
  POWERUP_SPAWN_INTERVAL: 6000, // ms – power-ups appear more often
  POWERUP_DURATION: 6000,       // ms active time – longer effect

  // Speed scaling
  SPEED_INCREMENT: 0.0003,  // very gentle acceleration
  MAX_SPEED_MULTIPLIER: 2.2, // lower cap so it never gets unplayable

  // Score
  SCORE_PER_SECOND: 1,

  // Game area
  GAME_WIDTH: 480,
  GAME_HEIGHT: 600,

  // FPS target
  FRAME_RATE: 60,
};

export const POWER_UP_TYPES = {
  SPEED_BOOST: 'speed_boost',
  DOUBLE_SCORE: 'double_score',
  SHIELD: 'shield',
};

export const OBSTACLE_TYPES = [
  { id: 'bug',    emoji: '🐛', label: 'Bug'         },
  { id: 'error',  emoji: '💥', label: 'Error Block'  },
  { id: 'crash',  emoji: '💻', label: 'Crash Screen' },
  { id: 'virus',  emoji: '🦠', label: 'Virus'        },
];

export const TOKEN_COLORS = [
  '#FF4081', // pink
  '#FF6D00', // orange
  '#FFEA00', // yellow
  '#00E676', // green
  '#00B0FF', // blue
  '#D500F9', // purple
];

export const HOLI_COLORS = [
  '#FF4081',
  '#FF6D00',
  '#FFEA00',
  '#00E676',
  '#00B0FF',
  '#D500F9',
  '#FF1744',
  '#F50057',
];
