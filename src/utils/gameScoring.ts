import { Difficulty } from '@/types/game';

export const calculateGameScore = (
  wordsLength: number,
  hintsUsed: number,
  difficulty: Difficulty
) => {
  const baseScore = wordsLength * 100;
  const hintPenalty = hintsUsed * 25;
  const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 }[difficulty];
  return Math.max(0, Math.floor((baseScore - hintPenalty) * difficultyMultiplier));
};

export const calculateTokenReward = (
  baseReward: number,
  difficulty: Difficulty,
  wordsFoundSize: number,
  totalWords: number,
  hintsUsed: number
) => {
  const difficultyMultipliers = {
    easy: 1,
    medium: 1.5,
    hard: 2
  };
  
  const timeBonus = 1;
  const wordCompletionRate = wordsFoundSize / totalWords;
  const completionBonus = wordCompletionRate === 1 ? 1.2 : 1;
  const hintPenalty = Math.max(0, 1 - (hintsUsed * 0.1));
  
  return Math.floor(
    baseReward * 
    difficultyMultipliers[difficulty] * 
    timeBonus * 
    completionBonus * 
    hintPenalty
  );
};