import { createClient } from '@supabase/supabase-js';

// Using Lovable's Supabase integration
export const supabase = createClient(
  'https://ncpczlwrssgihpsbxbum.supabase.co',  // Your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcGN6bHdyc3NnaWhwc2J4YnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMDYxMzYsImV4cCI6MjA1MTc4MjEzNn0.Jlt1XAdA6NOQd1S4P35yqJV0xDIWOfT0nDOoS5fA0M8'    // Your anon key
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