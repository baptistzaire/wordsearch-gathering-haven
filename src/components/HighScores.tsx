import React from 'react';

interface HighScoresProps {
  scores: Array<{
    id: string;
    score: number;
  }>;
}

export const HighScores: React.FC<HighScoresProps> = ({ scores }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2">High Scores</h3>
      <div className="space-y-1">
        {scores.slice(0, 5).map((score, index) => (
          <div key={score.id} className="flex justify-between">
            <span>#{index + 1}</span>
            <span>{score.score} points</span>
          </div>
        ))}
      </div>
    </div>
  );
};