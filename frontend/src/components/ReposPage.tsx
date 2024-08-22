import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Repo {
  name: string;
  html_url: string;
}

const ReposPage: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const userName=localStorage.getItem('github_user');
  const accessToken = localStorage.getItem('github_access_token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepos = async () => {
      console.log("fetchrepo",accessToken)
      if (accessToken) {
        try {
          const reposResponse = await axios.get('https://api.github.com/user/repos', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setRepos(reposResponse.data);
        } catch (error) {
          console.error('Error fetching repositories:', error);
        }
      }
    };

    fetchRepos();
  }, [accessToken]);

  const handleDeploy = (repoUrl: string) => {
    navigate(`/deploy?repoUrl=${encodeURIComponent(repoUrl)}`);
  };

  

  return (
    <div className="p-4 ">

      <h1 className="text-2xl text-white font-bold mb-4">{userName} Repositories</h1>
      <ul className="my-2 p-5 mx-28 flex flex-col">
        {repos.map((repo) => (
          <li key={repo.name} className="mb-2 flex justify-between ">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {repo.name}
            </a>
            <button 
              onClick={() => handleDeploy(repo.html_url)} 
              className="text-white bg-green-500 hover:bg-green-600 p-3 rounded-md font-bold">
              Deploy
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReposPage;
