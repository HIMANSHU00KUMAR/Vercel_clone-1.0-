import  { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const useSocket = (deployID: string | null) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  console.log("socket = ",socket);

  useEffect(() => {
    const newSocket = io('http://localhost:9002');
    setSocket(newSocket);

    if (deployID) {
      newSocket.emit('subscribe', `logs:${deployID}`);

      newSocket.on('message', (message: string) => {
        setLogs(prevLogs => [...prevLogs, message]);
      });
    }

    return () => {
      newSocket.disconnect();
    };
  }, [deployID]);

  console.log("hooks log = =",logs)

  return logs;
};

export default useSocket;
