import { useEffect, useState } from "react";
import type { RankingSnapshot } from "../lib/supabase";
import { getAllRankings } from "../lib/db";
import { RankingPage } from "./RankingPage";

export function AllRankingsPage() {
  const [metric, setMetric] = useState<string>();
  const [allRankings, setAllRankings] = useState<RankingSnapshot[]>();

  useEffect(() => {
    if (!allRankings) {
      getAllRankings().then(setAllRankings);
    }
  }, [allRankings]);

  if (metric && allRankings)
    return (
      <RankingPage
        clearSelectedMetric={() => setMetric(undefined)}
        selectedMetric={metric}
        selectedRankings={
          allRankings.find((ranking) => ranking.metric === metric)?.ranking
        }
      />
    );

  return (
    <div className="container">
      {!allRankings && <div>Loading...</div>}
      {allRankings && (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <h1 style={{ color: "white" }}>Tous les classements</h1>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {allRankings.map((ranking) => (
              <div
                className="card-btn"
                key={ranking.metric}
                onClick={() => setMetric(ranking.metric)}
              >
                <p style={{ color: "black" }}>{ranking.metric}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
