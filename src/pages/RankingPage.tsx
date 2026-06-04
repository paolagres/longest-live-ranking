import { useState, useEffect } from 'react'
import { getRankings } from '../lib/db'
import type { Ranking } from '../lib/db'
import { getFriendImage } from '../lib/images'

export function RankingPage() {
  const [rankings, setRankings] = useState<Ranking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRankings()
  }, [])

  async function loadRankings() {
    try {
      setLoading(true)
      const data = await getRankings()
      setRankings(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rankings')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card">
        <h2>Loading rankings...</h2>
      </div>
    </div>
  )

  if (error) return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        <h2 style={{ color: '#e74c3c' }}>Error</h2>
        <p>{error}</p>
      </div>
    </div>
  )

  return (
    <div className="container" style={{ minHeight: '100vh', paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1>🏆 Longevity Rankings</h1>
          <p className="subtitle">
            Aggregated results from all comparisons
          </p>
        </div>

        {rankings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
            <h2>No Comparisons Yet</h2>
            <p className="subtitle">
              <a href="/" className="link">Start ranking</a> to see results!
            </p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '80px', textAlign: 'center' }}>Rank</th>
                    <th style={{ width: '80px' }}></th>
                    <th>Name</th>
                    <th style={{ textAlign: 'center' }}>Win Rate</th>
                    <th style={{ textAlign: 'center' }}>Wins</th>
                    <th style={{ textAlign: 'center' }}>Comparisons</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((ranking, index) => {
                    const medals = ['🥇', '🥈', '🥉']
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
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        </td>
                        <td className="name-cell">
                          {ranking.name}
                        </td>
                        <td className="center-text">
                          {ranking.total_comparisons > 0 ? (
                            <span style={{
                              fontWeight: '600',
                              color: ranking.score >= 0.6 ? '#27ae60' : ranking.score >= 0.4 ? '#f39c12' : '#e74c3c'
                            }}>
                              {(ranking.score * 100).toFixed(1)}%
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="center-text">
                          {ranking.wins}
                        </td>
                        <td className="center-text">
                          {ranking.total_comparisons}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <a href="/" className="btn">
                Add More Comparisons
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
