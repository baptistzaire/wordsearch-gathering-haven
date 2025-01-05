import React, { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WordGrid } from './WordGrid';
import { WordList } from './WordList';
import { GameControls } from './GameControls';
import { WinModal } from './WinModal';
import { useToast } from "@/hooks/use-toast";
import { generateGameGrid } from '@/utils/gridGenerator';
import { GameHeader } from './GameHeader';
import { sendTokensToWinner } from '@/utils/tokenUtils';
import { PublicKey } from '@solana/web3.js';

export type Difficulty = 'easy' | 'medium' | 'hard';

// Token mint address (replace with your actual token mint address after creating it)
const GAME_TOKEN_MINT = new PublicKey("YOUR_TOKEN_MINT_ADDRESS");

export const WordSearchGame: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [showWinModal, setShowWinModal] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [hintsUsed, setHintsUsed] = useState(0);
  const { connected, publicKey, wallet } = useWallet();
  const { toast } = useToast();

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
      handleWin();
    }
  };

  const handleHint = () => {
    const remainingWords = words.filter(word => !foundWords.has(word));
    if (remainingWords.length > 0) {
      const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
      handleWordFound(randomWord);
      setHintsUsed(hintsUsed + 1);
    }
  };

  const handleWin = async () => {
    if (connected && publicKey) {
      try {
        const tokensEarned = calculateTokenReward();
        // Note: In a production environment, this should be handled by a backend
        // to securely manage the mint authority
        await sendTokensToWinner(
          publicKey,
          tokensEarned,
          GAME_TOKEN_MINT,
          // This should be managed securely in production
          null as any // mintAuthority would go here
        );
        
        toast({
          title: "Tokens Sent!",
          description: `${tokensEarned} tokens have been sent to your wallet.`,
        });
      } catch (error) {
        console.error("Error sending tokens:", error);
        toast({
          title: "Error",
          description: "Failed to send tokens. Please try again.",
          variant: "destructive",
        });
      }
    }
    setShowWinModal(true);
  };

  const calculateTokenReward = (): number => {
    // Base reward
    let reward = 100;
    
    // Adjust based on difficulty
    const difficultyMultipliers = {
      easy: 1,
      medium: 1.5,
      hard: 2
    };
    
    reward *= difficultyMultipliers[difficulty];
    
    // Reduce reward based on hints used
    reward = Math.max(reward - (hintsUsed * 10), 10);
    
    return Math.floor(reward);
  };

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  useEffect(() => {
    if (connected) {
      toast({
        title: "Wallet Connected",
        description: `Connected to ${wallet?.adapter.name}`,
      });
    }
  }, [connected, wallet?.adapter.name]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <GameHeader 
          isWalletConnected={connected}
          onConnectWallet={() => null} // WalletMultiButton handles this now
        />

        <div className="flex justify-end">
          <WalletMultiButton className="bg-purple-600 hover:bg-purple-700" />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <GameControls
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            onNewGame={startNewGame}
            onHint={handleHint}
          />
          
          <div className="mt-6">
            <WordGrid
              grid={grid}
              words={words}
              foundWords={foundWords}
              onWordFound={handleWordFound}
              hintPosition={null}
            />
          </div>

          <div className="mt-6">
            <WordList words={words} foundWords={foundWords} />
          </div>
        </div>

        {showWinModal && (
          <WinModal
            onClose={() => setShowWinModal(false)}
            onNewGame={startNewGame}
            hintsUsed={hintsUsed}
            isWalletConnected={connected}
            tokensEarned={calculateTokenReward()}
          />
        )}
      </div>
    </div>
  );
};
