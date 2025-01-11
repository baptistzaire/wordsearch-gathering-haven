export type GameMode = 'classic' | 'blitz';

export const BLITZ_INTERVAL = 2000; // 2 seconds in milliseconds

export const gameModeParams = {
  classic: {
    name: 'Classic',
    description: 'Find all words at your own pace'
  },
  blitz: {
    name: 'Blitz',
    description: 'Grid regenerates every 2 seconds. Race against time!',
    interval: BLITZ_INTERVAL
  }
};