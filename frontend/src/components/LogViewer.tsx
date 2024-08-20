import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

interface LogViewerProps {
  deployID: string | null;
}

const socket = io('http://localhost:9002');

const LogViewer: React.FC<LogViewerProps> = ({ deployID }) => {
  const [logs, setLogs] = useState<string[]>([]);
  console.log("deployid from lowier = ",deployID)
  console.log("logs from viewwer",logs);

  useEffect(() => {
    if (deployID) {
      socket.emit('subscribe', `logs:${deployID}`);

      socket.on('message', (message: string) => {
        setLogs(prevLogs => [...prevLogs, message]);
      });
    }
  }, [deployID]);

  return (
    <div className="bg-gray-100 p-4 mt-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Logs for Deployment ID: {deployID}</h1>
      <div className="bg-white p-4 rounded shadow">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <p key={index} className="text-sm text-gray-800 mb-2">{log}</p>
          ))
        ) : (
          <p className="text-sm text-gray-500">No logs yet...</p>
        )}
      </div>
    </div>
  );
};

export default LogViewer;
