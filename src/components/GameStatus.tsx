import React from 'react';
import { HighScores } from './HighScores';

interface GameStatusProps {
  highScores?: any[];
}

export const GameStatus: React.FC<GameStatusProps> = ({ highScores }) => {
  return (
    <div className="space-y-4">
      {highScores && <HighScores scores={highScores} />}
    </div>
  );
};