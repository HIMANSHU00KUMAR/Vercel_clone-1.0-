import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GitHubLogin: React.FC = () => {
  const clientID = 'Ov23liRF2DZxKXgwErs3';
  const redirectURI = 'http://localhost:5173/auth/github/callback';
  const navigate = useNavigate();

  const loginWithGitHub = () => {
    console.log("click login....")
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`;
  };

  const handleGitHubCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    console.log("code === ",code)

    if (code) {
      try {
        const tokenResponse = await axios.post('http://localhost:5000/auth/github/callback', { code });
        const { access_token } = tokenResponse.data;

        localStorage.setItem('github_access_token', access_token);
        navigate('/repos');
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    }
  };

  React.useEffect(() => {
    handleGitHubCallback();
  }, []);

  return (
    <button onClick={loginWithGitHub}>
      Login with GitHub
    </button>
  );
};

export default GitHubLogin;
