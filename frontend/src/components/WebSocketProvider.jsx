import React, { createContext, useContext, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const ws = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log("WS Provider Mounting. Token:", token ? "Present" : "Missing");
    if (!token) return;


    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//localhost:8000/ws?token=${token}`;

    const connect = () => {
      ws.current = new WebSocket(wsUrl);

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'NEW_THREAT') {
          // Notifications disabled by user request
        }
      };

      ws.current.onclose = () => {
        console.log('WS Disconnected. Retrying in 5s...');
        setTimeout(connect, 5000);
      };

      ws.current.onerror = (err) => {
        console.error('WS Error:', err);
        ws.current.close();
      };
    };

    connect();

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [token]);

  return (
    <WebSocketContext.Provider value={ws.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
