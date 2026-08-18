import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { RankingPage } from "./pages/RankingPage";
import "./App.css";
import { AllRankingsPage } from "./pages/AllRankingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/all-rankings" element={<AllRankingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
