import React, { useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

interface TimerProps {
  timeLimit: number;
  timeLeft: number;
  onTimeUp: () => void;
}

export const Timer: React.FC<TimerProps> = ({ timeLimit, timeLeft, onTimeUp }) => {
  const progress = (timeLeft / timeLimit) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Time Remaining</span>
        <span>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};