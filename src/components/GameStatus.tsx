import React from 'react';
import { WalletStatus } from './WalletStatus';
import { HighScores } from './HighScores';

interface GameStatusProps {
  highScores?: any[];
}

export const GameStatus: React.FC<GameStatusProps> = ({ highScores }) => {
  return (
    <div className="space-y-4">
      <WalletStatus />
      {highScores && <HighScores scores={highScores} />}
    </div>
  );
};