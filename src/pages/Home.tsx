import { useState } from "react";
import { ComparisonGame } from "../components/ComparisonGame";
import { useNavigate } from "react-router-dom";

type HomeState = "comparing" | "complete";

export function Home() {
  const [state, setState] = useState<HomeState>("comparing");
  const navigate = useNavigate();

  function handleComplete() {
    setState("complete");
  }

  function handleReset() {
    setState("comparing");
  }

  if (state === "comparing") {
    return (
      <div
        className="container"
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
          justifyContent: "space-between",
          paddingBottom: "40px",
        }}
      >
        <ComparisonGame maxComparisons={10} onComplete={handleComplete} />
        <button className="btn" onClick={() => navigate("/ranking")}>
          Voir le classement
        </button>
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <div className="card" style={{ maxWidth: "600px", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>✅</div>
        <h2>Comparaisons terminées!</h2>
        <p className="subtitle">
          Merci pour votre participation. Rendez-vous sur la page de classement
          pour voir les résultats.
        </p>

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a href="/ranking" className="btn">
            Voir le classement
          </a>
          <button onClick={handleReset} className="btn btn-secondary">
            Faire plus de comparaisons
          </button>
        </div>
      </div>
    </div>
  );
}
