# Longevity Ranker Setup

## Database Setup

1. Create a Supabase project at https://supabase.com

2. Create the `comparisons` table with this SQL:

```sql
CREATE TABLE comparisons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  friend1 TEXT NOT NULL,
  friend2 TEXT NOT NULL,
  winner TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   - Find your URL and anon key in your Supabase project settings
   - URL: Project Settings > API > Project URL
   - Anon Key: Project Settings > API > Project API keys > anon/public

## Adding Friends

Edit `src/data/friends.json` and add your friends' names:

```json
[
  "Alice",
  "Bob",
  "Charlie",
  "Diana"
]
```

## Running the App

```bash
npm install
npm run dev
```

## How It Works

1. Choose how many comparisons to make
2. For each comparison, pick which friend will live longer
3. View the final rankings based on win rates
