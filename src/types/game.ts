export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameScore {
  user_id: string;
  score: number;
  difficulty: Difficulty;
  words_found: string[];
  hints_used: number;
}

export interface GameParameters {
  gridSize: number;
  timeLimit: number;
  rewardMultiplier: number;
}