import { createClient } from '@supabase/supabase-js';

// Using Lovable's Supabase integration
export const supabase = createClient(
  'https://ncpczlwrssgihpsbxbum.supabase.co',  // Your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'    // Replace with your actual anon key
);

export type GameScore = {
  id?: string;
  user_id: string;
  score: number;
  difficulty: string;
  words_found: string[];
  hints_used: number;
  created_at?: string;
};