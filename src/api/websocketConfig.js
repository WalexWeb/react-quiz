const BASE_WS_URL = import.meta.env.VITE_WS_BASE_URL || "ws://10.10.0.88:8000/api/v2/websocket";
const BASE_HTTP_URL = import.meta.env.VITE_BASE_URL || "http://10.10.0.88:8000/api/v2/websocket";

export const getWebSocketUrl = (path) => {
  return `${BASE_WS_URL}${path}`;
};

export const getAdminWebSocketUrl = (path) => {
  return `${BASE_HTTP_URL}${path}`;
};