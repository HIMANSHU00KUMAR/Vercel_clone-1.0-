import React from 'react';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';

import ReposPage from './components/ReposPage';
import Home from './components/Home';
import GitHubLogin from './components/GitHubLogin';
import DeployPage from './components/DeployPage';




const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/repos" element={<ReposPage />} />
        <Route path="/auth/github/callback" element={<GitHubLogin />} />
        <Route path="/deploy" element={<DeployPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
