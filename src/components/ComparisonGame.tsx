import { useState, useEffect } from "react";
import { getFriends, saveComparison } from "../lib/db";
import { getFriendImage } from "../lib/images";

interface Props {
  maxComparisons: number;
  onComplete: () => void;
}

export function ComparisonGame({ maxComparisons, onComplete }: Props) {
  const [friends, setFriends] = useState<string[]>([]);
  const [currentPair, setCurrentPair] = useState<[string, string] | null>(null);
  const [completedComparisons, setCompletedComparisons] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFriends();
  }, []);

  function loadFriends() {
    try {
      const data = getFriends();
      if (data.length < 2) {
        setError("You need at least 2 friends to compare");
        setLoading(false);
        return;
      }
      setFriends(data);
      setCurrentPair(getRandomPair(data));
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load friends");
      setLoading(false);
    }
  }

  function getRandomPair(friendList: string[]): [string, string] {
    const index1 = Math.floor(Math.random() * friendList.length);
    let index2 = Math.floor(Math.random() * friendList.length);
    if (index1 === index2) index2++;
    if (index2 >= friendList.length) index2 = index2 - 2;
    return [friendList[index1], friendList[index2]];
  }

  async function handleChoice(winner: string) {
    if (!currentPair) return;

    try {
      await saveComparison({
        friend1: currentPair[0],
        friend2: currentPair[1],
        winner,
      });

      const newCount = completedComparisons + 1;
      setCompletedComparisons(newCount);

      if (newCount >= maxComparisons) {
        onComplete();
      } else {
        setCurrentPair(getRandomPair(friends));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save comparison"
      );
    }
  }

  if (loading)
    return (
      <div
        className="container"
        style={{
          height: "100%",
          display: "flex",
        }}
      >
        <div className="card">
          <h2>Loading...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        className="container"
        style={{
          height: "100%",
          display: "flex",
        }}
      >
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
          <h2 style={{ color: "#e74c3c" }}>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );

  if (!currentPair) return null;

  const progress = (completedComparisons / maxComparisons) * 100;

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
      }}
    >
      <div className="card" style={{ textAlign: "center", width: "100%" }}>
        <h2>{import.meta.env.VITE_METRIC}</h2>

        <div style={{ margin: "30px 0" }}>
          <p className="progress-text">
            Question {completedComparisons + 1} of {maxComparisons}
          </p>
          <div
            style={{
              width: "100%",
              height: "8px",
              background: "#e0e0e0",
              borderRadius: "10px",
              overflow: "hidden",
              margin: "10px 0",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        <div className="flex-center" style={{ marginBottom: "20px" }}>
          <button
            onClick={() => handleChoice(currentPair[0])}
            className="choice-btn"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <img
              src={getFriendImage(currentPair[0])}
              alt={currentPair[0]}
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              }}
            />
            <span>{currentPair[0]}</span>
          </button>

          <div
            style={{
              fontSize: "32px",
              color: "#999",
              fontWeight: "bold",
            }}
          >
            VS
          </div>

          <button
            onClick={() => handleChoice(currentPair[1])}
            className="choice-btn"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <img
              src={getFriendImage(currentPair[1])}
              alt={currentPair[1]}
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              }}
            />
            <span>{currentPair[1]}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
