import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { RankingPage } from './pages/RankingPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<RankingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
