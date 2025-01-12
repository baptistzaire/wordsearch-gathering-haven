import React from 'react';
import { Trophy } from 'lucide-react';

interface HighScoresProps {
  scores: Array<{
    id: string;
    score: number;
  }>;
}

export const HighScores: React.FC<HighScoresProps> = ({ scores }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/20 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">High Scores</h3>
      </div>
      <div className="space-y-2">
        {scores.slice(0, 5).map((score, index) => (
          <div 
            key={score.id} 
            className="flex justify-between items-center p-2 rounded-lg hover:bg-accent/10 transition-colors"
          >
            <span className="font-medium">#{index + 1}</span>
            <span className="text-primary font-semibold">{score.score} points</span>
          </div>
        ))}
      </div>
    </div>
  );
};