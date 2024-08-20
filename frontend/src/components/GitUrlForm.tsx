import React, { useState } from 'react';
import LogViewer from './LogViewer';

const GitUrlForm: React.FC = () => {
  const [gitURL, setGitUrl] = useState<string>('');
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [deployID, setDeployID] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:9000/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gitURL }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch deployment URL');
      }

      const data = await response.json();
      console.log("data =",data);
      setDeployUrl(data.data.url);
      setDeployID(data.data.projectSlug);
    } catch (error) {
      console.error('Error:', error);
      setDeployUrl(null);
    } finally {
      setLoading(false);
    }
  };

  console.log("deploy = ", deployUrl);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Enter Git URL</h2>
        <input
          type="text"
          value={gitURL}
          onChange={(e) => setGitUrl(e.target.value)}
          placeholder="https://github.com/username/repo"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Deploying...' : 'Get Deploy URL'}
        </button>
      </form>

      {deployUrl && (
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
      )}
      {deployID && <LogViewer deployID={deployID} />}
    </div>
  );
};

export default GitUrlForm;
