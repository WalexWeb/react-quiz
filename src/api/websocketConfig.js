const BASE_WS_URL = import.meta.env.VITE_WS_BASE_URL || "ws://0.0.0.0:8000/api/v2/websocket";
const BASE_HTTP_URL = import.meta.env.VITE_BASE_URL || "http://0.0.0.0:8000/api/v2/websocket";

export const getWebSocketUrl = (path) => {
  return `${BASE_WS_URL}${path}`;
};

export const getAdminWebSocketUrl = (path) => {
  return `${BASE_HTTP_URL}${path}`;
};