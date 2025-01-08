import React from 'react';
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { Difficulty } from '@/types/game';

interface SocialShareProps {
  difficulty: Difficulty;
  wordsFound: number;
  totalWords: number;
  tokensEarned: number;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  difficulty,
  wordsFound,
  totalWords,
  tokensEarned,
}) => {
  const shareMessage = `I just completed a ${difficulty} word search puzzle! Found ${wordsFound}/${totalWords} words and earned ${tokensEarned} tokens! 🎮✨ #SolanaWordSearch`;
  
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareMessage)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Solana Word Search Game')}&summary=${encodeURIComponent(shareMessage)}`,
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-gray-600 mb-2">Share your achievement!</p>
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare('twitter')}
          className="hover:bg-sky-50 hover:text-sky-600"
        >
          <Twitter className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare('facebook')}
          className="hover:bg-blue-50 hover:text-blue-600"
        >
          <Facebook className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare('linkedin')}
          className="hover:bg-blue-50 hover:text-blue-700"
        >
          <Linkedin className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};