import React from 'react';
import { WinModal } from '../WinModal';
import { calculateTokenReward } from '@/utils/gameScoring';
import { Difficulty } from '@/types/game';

interface GameStateManagerProps {
  showWinModal: boolean;
  setShowWinModal: (show: boolean) => void;
  startNewGame: () => void;
  hintsUsed: number;
  connected: boolean;
  difficulty: Difficulty;
  foundWords: Set<string>;
  words: string[];
}

export const GameStateManager: React.FC<GameStateManagerProps> = ({
  showWinModal,
  setShowWinModal,
  startNewGame,
  hintsUsed,
  connected,
  difficulty,
  foundWords,
  words,
}) => {
  if (!showWinModal) return null;

  return (
    <WinModal
      onClose={() => setShowWinModal(false)}
      onNewGame={startNewGame}
      hintsUsed={hintsUsed}
      isWalletConnected={connected}
      tokensEarned={calculateTokenReward(100, difficulty, foundWords.size, words.length, hintsUsed)}
      difficulty={difficulty}
      wordsFound={foundWords.size}
      totalWords={words.length}
    />
  );
};