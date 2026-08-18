import { useState, useEffect } from "react";
import { getRankings, saveCurrentRanking } from "../lib/db";
import type { Ranking } from "../lib/db";
import { getFriendImage } from "../lib/images";
import { useNavigate } from "react-router-dom";

interface RankingPageProps {
  selectedMetric?: string;
  selectedRankings?: Ranking[];
  clearSelectedMetric?: () => void;
}

export function RankingPage({
  selectedMetric,
  selectedRankings,
  clearSelectedMetric,
}: RankingPageProps) {
  const [rankings, setRankings] = useState<Ranking[]>(selectedRankings || []);
  const [loading, setLoading] = useState(!selectedMetric);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!rankings.length) loadRankings(setLoading, setRankings, setError);
  }, []);

  if (loading)
    return (
      <div
        className="ranking-container"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="ranking-card">
          <h2>Chargement du classement...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        className="ranking-container"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="ranking-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
          <h2 style={{ color: "#e74c3c" }}>Erreur</h2>
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="ranking-container" style={{ minHeight: "100vh" }}>
      <div className="ranking-card">
        <button
          className="btn-small"
          onClick={() => {
            if (clearSelectedMetric) clearSelectedMetric();
            navigate("/all-rankings");
          }}
          style={{ alignSelf: "flex-start" }}
        >
          ← Voir les autres classements
        </button>
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            marginTop: "10px",
          }}
        >
          <h1>{selectedMetric ?? import.meta.env.VITE_METRIC}</h1>
        </div>

        {rankings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>📊</div>
            <h2>Aucune comparaison encore</h2>
            <p className="subtitle">
              <a href="/" className="link">
                Commencer le classement
              </a>{" "}
              pour voir les résultats!
            </p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}></th>
                    <th></th>
                    <th>Nom</th>
                    <th style={{ textAlign: "center" }}>Victoires</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((ranking, index) => {
                    const medals = ["🥇", "🥈", "🥉"];
                    return (
                      <tr key={ranking.name}>
                        <td className="rank-cell center-text">
                          {index < 3 ? medals[index] : `#${index + 1}`}
                        </td>
                        <td>
                          <img
                            src={getFriendImage(ranking.name)}
                            alt={ranking.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                        </td>
                        <td className="name-cell">{ranking.name}</td>
                        <td style={{ textAlign: "end", paddingRight: "10px" }}>
                          {ranking.total_comparisons > 0 ? (
                            <div>
                              <span
                                style={{
                                  fontWeight: "600",
                                  color:
                                    ranking.score >= 0.6
                                      ? "#27ae60"
                                      : ranking.score >= 0.4
                                      ? "#f39c12"
                                      : "#e74c3c",
                                }}
                              >
                                {(ranking.score * 100).toFixed(1)}%
                              </span>
                              <p style={{ fontSize: "12px" }}>
                                ({ranking.wins} / {ranking.total_comparisons})
                              </p>
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                display: "flex",
                gap: "15px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn"
                onClick={() => handleSaveRanking(rankings, setSaving)}
                disabled={saving}
              >
                {saving
                  ? "Enregistrement..."
                  : "Enregistrer le classement actuel"}
              </button>
              <button className="btn-secondary" onClick={() => navigate("/")}>
                Continuer les comparaisons
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

async function loadRankings(
  setLoading: (loading: boolean) => void,
  setRankings: (rankings: Ranking[]) => void,
  setError: (error: string | null) => void
) {
  try {
    setLoading(true);
    const data = await getRankings();
    setRankings(data);
    setError(null);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to load rankings");
  } finally {
    setLoading(false);
  }
}

async function handleSaveRanking(
  rankings: Ranking[],
  setSaving: (saving: boolean) => void
) {
  try {
    setSaving(true);
    await saveCurrentRanking(rankings);
  } catch (err) {
    console.error(err);
  } finally {
    setSaving(false);
  }
}
