export type GameMode = 'classic' | 'blitz' | 'semantic';

export const BLITZ_INTERVAL = 2000; // 2 seconds

export const gameModeParams = {
  classic: {
    name: 'Classic',
    description: 'Find words at your own pace'
  },
  blitz: {
    name: 'Blitz',
    description: 'Grid regenerates every 2 seconds'
  },
  semantic: {
    name: 'Semantic Shift',
    description: 'Words transform into synonyms - use tokens to reveal originals'
  }
};