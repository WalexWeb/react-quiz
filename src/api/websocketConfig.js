const BASE_WS_URL = import.meta.env.VITE_WS_BASE_URL || "ws://10.10.0.88:8000/api/v2/websocket";

export const getWebSocketUrl = (path) => {
  return `${BASE_WS_URL}${path}`;
};