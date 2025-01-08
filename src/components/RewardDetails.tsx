import React from 'react';
import { Coins, AlertTriangle } from 'lucide-react';
import { Difficulty } from '@/types/game';

interface RewardDetailsProps {
  isWalletConnected: boolean;
  tokensEarned: number;
  difficulty: Difficulty;
  wordsFound: number;
  totalWords: number;
  hintsUsed: number;
}

export const RewardDetails: React.FC<RewardDetailsProps> = ({
  isWalletConnected,
  tokensEarned,
  difficulty,
  wordsFound,
  totalWords,
  hintsUsed
}) => {
  const difficultyMultipliers = {
    easy: '1x',
    medium: '1.5x',
    hard: '2x'
  };

  if (!isWalletConnected) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          Connect your wallet to earn tokens for completing puzzles!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center justify-center text-purple-800 mb-4">
          <Coins className="w-6 h-6 mr-2" />
          <span className="text-xl font-bold">{tokensEarned} Tokens Earned!</span>
        </div>
        
        <div className="space-y-2 text-sm text-purple-700">
          <div className="flex items-center justify-between">
            <span>Difficulty Bonus:</span>
            <span className="font-medium">{difficultyMultipliers[difficulty]}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Words Found:</span>
            <span className="font-medium">{wordsFound}/{totalWords}</span>
          </div>
          
          {hintsUsed > 0 && (
            <div className="flex items-center justify-between text-amber-600">
              <span>Hint Penalty:</span>
              <span className="font-medium">-{hintsUsed * 10}%</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        <span>Transaction fees will apply when claiming rewards</span>
      </div>
    </div>
  );
};