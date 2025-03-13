const BASE_WS_URL = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8000/api/v2/websocket";

export const getWebSocketUrl = (path) => {
  return `${BASE_WS_URL}${path}`;
};