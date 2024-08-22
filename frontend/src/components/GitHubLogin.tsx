import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GitHubLogin = () => {
  console.log("Entering GitHubLogin component");
  const navigate = useNavigate();

  const handleGitHubCallback = async () => {
    const storedToken = localStorage.getItem("github_access_token");

    // If the access token is already in localStorage, use it directly
    if (storedToken) {
      console.log("Access token found in localStorage");
      navigate("/repos");
      return;
    }

    // If no token is found, continue with the GitHub OAuth process
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    console.log("OAuth code received:", code);

    if (code) {
      try {
        const response = await axios.post(
          "http://localhost:5001/auth/github/callback",
          { code }
        );
        const { access_token, user } = response.data;

        console.log("Received access token:", access_token);
        console.log("Received user info:", user);

        // Store the access token and user info in localStorage
        localStorage.setItem("github_access_token", access_token);
        localStorage.setItem("github_user", JSON.stringify(user.login));

        navigate("/repos");
      } catch (error:any) {
        console.error("Error fetching access token:", error.response?.data || error.message);
      }
    }
  };

  useEffect(() => {
    handleGitHubCallback();
  }, []);

  return <div>GitHubLogin is loading...</div>;
};

export default GitHubLogin;
