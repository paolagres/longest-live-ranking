import { useState } from 'react'
import { ComparisonGame } from '../components/ComparisonGame'

type HomeState = 'comparing' | 'complete'

export function Home() {
  const [state, setState] = useState<HomeState>('comparing')

  function handleComplete() {
    setState('complete')
  }

  function handleReset() {
    setState('comparing')
  }

  if (state === 'comparing') {
    return (
      <ComparisonGame
        maxComparisons={10}
        onComplete={handleComplete}
      />
    )
  }

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="card" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
        <h2>Comparisons Complete!</h2>
        <p className="subtitle">
          Thank you for your input. Visit the rankings page to see the overall results.
        </p>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/ranking" className="btn">
            View Rankings
          </a>
          <button onClick={handleReset} className="btn btn-secondary">
            Do More Comparisons
          </button>
        </div>
      </div>
    </div>
  )
}
