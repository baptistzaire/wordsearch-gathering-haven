import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
export const supabase = createClient(
  'https://your-project-url.supabase.co',  // Replace this with your project URL
  'your-anon-key'  // Replace this with your project's anon key
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