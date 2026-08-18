import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Comparison {
  id?: string
  friend1: string
  friend2: string
  winner: string
  created_at?: string
}

export interface Ranking {
  name: string
  score: number
  wins: number
  total_comparisons: number
}

export interface RankingSnapshot {
  id?: string
  metric: string
  ranking: Ranking[]
}
