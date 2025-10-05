// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LearningPage from './pages/LearningPage';
import ModulePage from './pages/ModulePage';
import QuizPage from './pages/QuizPage';
import PredictorPage from './pages/PredictorPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="font-sans bg-gray-900 text-white w-screen h-screen overflow-hidden">
        <Navbar />
        <main className="pt-20 h-full"> {/* Add padding-top to avoid overlap with fixed navbar */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearningPage />} />
            <Route path="/learn/:level" element={<ModulePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/predictor" element={<PredictorPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;