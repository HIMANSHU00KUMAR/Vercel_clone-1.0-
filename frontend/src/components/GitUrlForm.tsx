import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LogViewer from './LogViewer';

const DeployPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const repoUrl = searchParams.get('repoUrl');
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [deployID, setDeployID] = useState<string | null>(null);


  console.log("deploy url",deployUrl);

  const handleSubmit = async () => {
    if (!repoUrl) return;

    console.log("handle submit cickcked",repoUrl)

    setLoading(true);

    try {
      const response = await fetch('http://localhost:9000/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gitURL: repoUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch deployment URL');
      }

      const data = await response.json();
      setDeployUrl(data.data.url);
      setDeployID(data.data.projectSlug);
    } catch (error) {
      console.error('Error:', error);
      setDeployUrl(null);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    handleSubmit();
  },[repoUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <p>Deploying... Please wait.</p>
      ) : (
        deployUrl && (
          <div className="mt-6 text-center">
            <p className="text-xl">Deployment id: {deployID}</p>
            <p className="text-xl">Deployment URL:</p>
            <a
              href={deployUrl}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {deployUrl}
            </a>
          </div>
          
        )
      )}
      {deployID && <LogViewer deployID={deployID} />}
    </div>
  );
};

export default DeployPage;
