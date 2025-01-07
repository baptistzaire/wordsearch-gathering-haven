-- Create the game_scores table
create table public.game_scores (
    id uuid default gen_random_uuid() primary key,
    user_id text not null,
    score integer not null,
    difficulty text not null,
    words_found text[] not null,
    hints_used integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.game_scores enable row level security;

-- Create policy to allow anyone to read scores
create policy "Anyone can read game scores"
on public.game_scores
for select
to public
using (true);

-- Create policy to allow authenticated users to insert their own scores
create policy "Users can insert their own scores"
on public.game_scores
for insert
to public
with check (true);

-- Create index on score for faster leaderboard queries
create index game_scores_score_idx on public.game_scores(score desc);