import React, { useState, useEffect, useCallback } from 'react';
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
import { GameMode, BLITZ_INTERVAL } from '@/types/gameMode';
import { Button } from './ui/button';
import { PlayCircle } from 'lucide-react';
import { GameModeSelector } from './GameModeSelector';
import { DifficultySelector } from './DifficultySelector';
import { AuthButton } from './AuthButton';
import { TokenWithdrawal } from './TokenWithdrawal';

export const WordSearchGame: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [showWinModal, setShowWinModal] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const { connected, publicKey } = useWallet();
  const { toast } = useToast();
  const [tokens, setTokens] = useState(0);

  // Query for session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  // Query for high scores
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
  });

  // Mutation for saving scores
  const { mutate: saveScore } = useMutation({
    mutationFn: async (score: number) => {
      if (!session?.user.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('game_scores')
        .insert({
          user_id: session.user.id,
          score: score,
          difficulty: difficulty,
          words_found: Array.from(foundWords),
          hints_used: hintsUsed
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Score saved!",
        description: "Your score has been recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving score",
        description: "There was a problem saving your score.",
        variant: "destructive",
      });
      console.error('Error saving score:', error);
    },
  });

  const generateNewGrid = useCallback(() => {
    const wordLists = {
      easy: ['CAT', 'DOG', 'RAT', 'BAT'],
      medium: ['PYTHON', 'JAVA', 'RUBY', 'SWIFT', 'RUST'],
      hard: ['JAVASCRIPT', 'TYPESCRIPT', 'ASSEMBLY', 'HASKELL']
    };
    
    const gridSizes = { easy: 8, medium: 10, hard: 12 };
    const selectedWords = wordLists[difficulty].filter(word => !foundWords.has(word));
    const gridSize = gridSizes[difficulty];
    
    setWords(selectedWords);
    setGrid(generateGameGrid(gridSize, selectedWords));
  }, [difficulty, foundWords]);

  const startNewGame = () => {
    if (!connected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to start the game.",
        variant: "destructive",
      });
      return;
    }

    generateNewGrid();
    setFoundWords(new Set());
    setHintsUsed(0);
    setShowWinModal(false);
    setGameStarted(true);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (gameStarted && gameMode === 'blitz') {
      intervalId = setInterval(() => {
        generateNewGrid();
      }, BLITZ_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [gameStarted, gameMode, generateNewGrid]);

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

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-4">
        <h1 className="text-3xl font-bold text-purple-800">
          Word Search Game
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          Sign in to start playing and earning tokens!
        </p>
        <AuthButton />
      </div>
    );
  }

  return (
    <GameLayout
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      startNewGame={startNewGame}
      highScores={highScores}
    >
      <TokenWithdrawal 
        tokens={tokens}
        onWithdraw={() => {
          toast({
            title: "Withdrawal initiated",
            description: "Your tokens are being transferred to your wallet.",
          });
        }}
      />
      
      <GameStatus highScores={highScores} />
      
      {!gameStarted ? (
        <div className="flex flex-col items-center space-y-6 p-8">
          <h2 className="text-2xl font-semibold text-purple-800">
            Welcome to Word Search Game
          </h2>
          <p className="text-gray-600 text-center max-w-md">
            Connect your wallet and select difficulty to start playing.
            Find all the words to earn tokens!
          </p>
          <div className="flex flex-col gap-4 items-center">
            <GameModeSelector
              currentMode={gameMode}
              onSelect={setGameMode}
            />
            <DifficultySelector
              currentDifficulty={difficulty}
              onSelect={setDifficulty}
            />
            <Button
              onClick={startNewGame}
              disabled={!connected}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          </div>
        </div>
      ) : (
        <GameBoard
          grid={grid}
          words={words}
          foundWords={foundWords}
          onWordFound={handleWordFound}
          hintPosition={null}
        />
      )}
      
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
