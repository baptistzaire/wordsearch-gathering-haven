import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { generateGameGrid } from '@/utils/gridGenerator';
import { WinModal } from './WinModal';
import { GameLayout } from './GameLayout';
import { GameBoard } from './GameBoard';
import { Timer } from './Timer';
import { useToast } from "@/hooks/use-toast";
import { Difficulty, GameScore } from '@/types/game';

export const WordSearchGame: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [showWinModal, setShowWinModal] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // Default to easy mode time
  const [isGameActive, setIsGameActive] = useState(false);
  const { connected, publicKey, wallet } = useWallet();
  const { toast } = useToast();

  const difficultySettings = {
    easy: { timeLimit: 180, gridSize: 8 },
    medium: { timeLimit: 240, gridSize: 10 },
    hard: { timeLimit: 300, gridSize: 12 }
  };

  const { data: highScores } = useQuery({
    queryKey: ['highScores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: connected,
  });

  // Save score mutation
  const { mutate: saveScore } = useMutation({
    mutationFn: async (score: number) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      const gameScore = {
        user_id: publicKey.toString(),
        score,
        difficulty,
        words_found: Array.from(foundWords),
        hints_used: hintsUsed,
      };

      const { error } = await supabase
        .from('game_scores')
        .insert([gameScore]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Score saved!",
        description: "Your score has been recorded on the leaderboard.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving score",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

  const startNewGame = () => {
    const wordLists = {
      easy: ['CAT', 'DOG', 'RAT', 'BAT'],
      medium: ['PYTHON', 'JAVA', 'RUBY', 'SWIFT', 'RUST'],
      hard: ['JAVASCRIPT', 'TYPESCRIPT', 'ASSEMBLY', 'HASKELL']
    };
    
    const selectedWords = wordLists[difficulty];
    const { gridSize, timeLimit } = difficultySettings[difficulty];
    
    setWords(selectedWords);
    setGrid(generateGameGrid(gridSize, selectedWords));
    setFoundWords(new Set());
    setHintsUsed(0);
    setTimeLeft(timeLimit);
    setShowWinModal(false);
    setIsGameActive(true);
  };

  const handleTimeUp = () => {
    setIsGameActive(false);
    setShowWinModal(true);
    if (connected) {
      const score = calculateScore();
      saveScore(score);
    }
  };

  const handleWordFound = (word: string) => {
    const newFoundWords = new Set(foundWords);
    newFoundWords.add(word);
    setFoundWords(newFoundWords);
    
    if (newFoundWords.size === words.length) {
      setIsGameActive(false);
      setShowWinModal(true);
      if (connected) {
        const score = calculateScore();
        saveScore(score);
      }
    }
  };

  const calculateScore = () => {
    const baseScore = words.length * 100;
    const hintPenalty = hintsUsed * 25;
    const timeBonus = Math.floor((timeLeft / difficultySettings[difficulty].timeLimit) * 100);
    const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 }[difficulty];
    return Math.max(0, Math.floor((baseScore - hintPenalty + timeBonus) * difficultyMultiplier));
  };

  const calculateTokenReward = () => {
    const baseReward = 100;
    const difficultyMultipliers = {
      easy: 1,
      medium: 1.5,
      hard: 2
    };
    
    // Calculate time bonus (if we implement a timer later)
    const timeBonus = 1; // Placeholder for now
    
    // Calculate word completion bonus
    const wordCompletionRate = foundWords.size / words.length;
    const completionBonus = wordCompletionRate === 1 ? 1.2 : 1;
    
    // Apply hint penalty
    const hintPenalty = Math.max(0, 1 - (hintsUsed * 0.1));
    
    const finalReward = Math.floor(
      baseReward * 
      difficultyMultipliers[difficulty] * 
      timeBonus * 
      completionBonus * 
      hintPenalty
    );
    
    return finalReward;
  };

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  return (
    <GameLayout
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      startNewGame={startNewGame}
      highScores={highScores}
    >
      <div className="space-y-6">
        <Timer 
          timeLimit={difficultySettings[difficulty].timeLimit}
          timeLeft={timeLeft}
          onTimeUp={handleTimeUp}
        />
        
        <GameBoard
          grid={grid}
          words={words}
          foundWords={foundWords}
          onWordFound={handleWordFound}
          hintPosition={null}
        />
      </div>
      
      {showWinModal && (
        <WinModal
          onClose={() => setShowWinModal(false)}
          onNewGame={startNewGame}
          hintsUsed={hintsUsed}
          isWalletConnected={connected}
          tokensEarned={calculateTokenReward()}
          difficulty={difficulty}
          wordsFound={foundWords.size}
          totalWords={words.length}
          timeLeft={timeLeft}
        />
      )}
    </GameLayout>
  );
};
