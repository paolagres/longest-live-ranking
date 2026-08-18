import { supabase } from "./supabase";
import type { Comparison, Ranking, RankingSnapshot } from "./supabase";
import friendsData from "../data/friends.json";

export type { Ranking } from "./supabase";

export function getFriends(): string[] {
  return friendsData;
}

export async function saveComparison(
  comparison: Omit<Comparison, "id" | "created_at">
): Promise<void> {
  const { error } = await supabase.from("comparisons").insert(comparison);

  if (error) throw error;
}

export async function saveCurrentRanking(ranking: Ranking[]): Promise<void> {
  const metric = import.meta.env.VITE_METRIC;
  const { data: existing, error: lookupError } = await supabase
    .from("rankings")
    .select("id")
    .eq("metric", metric)
    .limit(1)
    .maybeSingle();

  if (lookupError) throw lookupError;

  if (existing) {
    const { error } = await supabase
      .from("rankings")
      .update({ ranking })
      .eq("id", existing.id);

    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("rankings").insert({
    metric,
    ranking,
  });

  if (error) throw error;
}

export async function getRankings(): Promise<Ranking[]> {
  const { data, error } = await supabase
    .from("comparisons")
    .select("friend1, friend2, winner");

  if (error) throw error;

  const friends = getFriends();
  const scoreMap = new Map<string, { wins: number; total: number }>();

  friends.forEach((friend) => {
    scoreMap.set(friend, { wins: 0, total: 0 });
  });

  data?.forEach((comp) => {
    const friend1Stats = scoreMap.get(comp.friend1);
    const friend2Stats = scoreMap.get(comp.friend2);

    if (friend1Stats) friend1Stats.total++;
    if (friend2Stats) friend2Stats.total++;

    const winnerStats = scoreMap.get(comp.winner);
    if (winnerStats) winnerStats.wins++;
  });

  const rankings: Ranking[] = friends
    .map((friend) => {
      const stats = scoreMap.get(friend)!;
      return {
        name: friend,
        score: stats.total > 0 ? stats.wins / stats.total : 0,
        wins: stats.wins,
        total_comparisons: stats.total,
      };
    })
    .sort((a, b) => b.score - a.score);

  return rankings;
}

export async function getAllRankings(): Promise<RankingSnapshot[]> {
  const { data, error } = await supabase
    .from("rankings")
    .select("metric, ranking");

  if (error) throw error;

  return data;
}
