import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/home';
import SignUpPage from './components/signup';
import LoginPage from './components/LoginPage';
import PersonalizedRecommendations from './components/PersonalizedRecommendations'; 

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recs" element={<PersonalizedRecommendations />} /> 
      </Routes>
    </div>
  );
}

export default App;
