import React, { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface TimerProps {
  timeLimit: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({ timeLimit, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  
  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / timeLimit) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Clock className="w-4 h-4" />
        <span>{formatTime(timeLeft)}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};