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
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameResult, setGameResult] = useState<'won' | 'timeout' | null>(null);
  const { connected, publicKey } = useWallet();
  const { toast } = useToast();

  const difficultyParams = {
    easy: { gridSize: 8, timeLimit: 180, rewardMultiplier: 1 },
    medium: { gridSize: 10, timeLimit: 240, rewardMultiplier: 1.5 },
    hard: { gridSize: 12, timeLimit: 300, rewardMultiplier: 2 },
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

  const startNewGame = () => {
    const wordLists = {
      easy: ['CAT', 'DOG', 'RAT', 'BAT'],
      medium: ['PYTHON', 'JAVA', 'RUBY', 'SWIFT', 'RUST'],
      hard: ['JAVASCRIPT', 'TYPESCRIPT', 'ASSEMBLY', 'HASKELL']
    };
    
    const selectedWords = wordLists[difficulty];
    const gridSize = difficultyParams[difficulty].gridSize;
    
    setWords(selectedWords);
    setGrid(generateGameGrid(gridSize, selectedWords));
    setFoundWords(new Set());
    setHintsUsed(0);
    setShowWinModal(false);
    setGameResult(null);
    setIsGameActive(true);
  };

  const handleWordFound = (word: string) => {
    const newFoundWords = new Set(foundWords);
    newFoundWords.add(word);
    setFoundWords(newFoundWords);
    
    if (newFoundWords.size === words.length) {
      handleGameEnd('won');
    }
  };

  const handleTimeUp = () => {
    if (foundWords.size < words.length) {
      handleGameEnd('timeout');
    }
  };

  const handleGameEnd = (result: 'won' | 'timeout') => {
    setIsGameActive(false);
    setGameResult(result);
    setShowWinModal(true);
    
    if (connected && result === 'won') {
      const score = calculateScore();
      saveScore(score);
    }
  };

  const calculateScore = () => {
    const baseScore = words.length * 100;
    const hintPenalty = hintsUsed * 25;
    const difficultyMultiplier = difficultyParams[difficulty].rewardMultiplier;
    return Math.max(0, Math.floor((baseScore - hintPenalty) * difficultyMultiplier));
  };

  const calculateTokenReward = () => {
    const baseReward = 100;
    const difficultyMultiplier = difficultyParams[difficulty].rewardMultiplier;
    
    // Calculate word completion bonus
    const wordCompletionRate = foundWords.size / words.length;
    const completionBonus = wordCompletionRate === 1 ? 1.2 : 1;
    
    // Apply hint penalty
    const hintPenalty = Math.max(0, 1 - (hintsUsed * 0.1));
    
    const finalReward = Math.floor(
      baseReward * 
      difficultyMultiplier * 
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
      <div className="space-y-4">
        <Timer 
          timeLimit={difficultyParams[difficulty].timeLimit}
          onTimeUp={handleTimeUp}
          isActive={isGameActive}
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
          gameResult={gameResult}
        />
      )}
    </GameLayout>
  );
};