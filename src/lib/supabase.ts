import { createClient } from '@supabase/supabase-js';

// Using Lovable's Supabase integration
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
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