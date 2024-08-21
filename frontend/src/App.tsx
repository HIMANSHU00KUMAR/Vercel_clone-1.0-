import React from 'react';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import GitHubLogin from './components/GitHubLogin';
import ReposPage from './components/ReposPage';
import GitUrlForm from './components/GitUrlForm';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GitHubLogin />} />
        <Route path="/repos" element={<ReposPage />} />
        <Route path="/auth/github/callback" element={<GitHubLogin />} />
        <Route path="/deploy" element={<GitUrlForm/>} />
      </Routes>
    </Router>
  );
};

export default App;
