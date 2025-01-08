import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { generateGameGrid } from '@/utils/gridGenerator';
import { calculateGameScore, calculateTokenReward } from '@/utils/gameScoring';
import { WinModal } from './WinModal';
import { GameLayout } from './GameLayout';
import { GameBoard } from './GameBoard';
import { GameStatus } from './GameStatus';
import { useToast } from "@/hooks/use-toast";
import { Difficulty } from '@/types/game';

export const WordSearchGame: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [showWinModal, setShowWinModal] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [hintsUsed, setHintsUsed] = useState(0);
  const { connected, publicKey } = useWallet();
  const { toast } = useToast();

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
    
    const gridSizes = { easy: 8, medium: 10, hard: 12 };
    const selectedWords = wordLists[difficulty];
    const gridSize = gridSizes[difficulty];
    
    setWords(selectedWords);
    setGrid(generateGameGrid(gridSize, selectedWords));
    setFoundWords(new Set());
    setHintsUsed(0);
    setShowWinModal(false);
  };

  const handleWordFound = (word: string) => {
    const newFoundWords = new Set(foundWords);
    newFoundWords.add(word);
    setFoundWords(newFoundWords);
    
    if (newFoundWords.size === words.length) {
      setShowWinModal(true);
      if (connected) {
        const score = calculateGameScore(words.length, hintsUsed, difficulty);
        saveScore(score);
      }
    }
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
      <GameStatus highScores={highScores} />
      
      <GameBoard
        grid={grid}
        words={words}
        foundWords={foundWords}
        onWordFound={handleWordFound}
        hintPosition={null}
      />
      
      {showWinModal && (
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
      )}
    </GameLayout>
  );
};