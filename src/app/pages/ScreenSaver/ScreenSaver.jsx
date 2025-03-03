import { useEffect, useRef } from "react";
import styles from "./ScreenSaver.module.scss";
import { useNavigate } from "react-router-dom";

function ScreenSaver() {
  const navigate = useNavigate();
  const wsRef = useRef(null);
  const isConnecting = useRef(false);

  useEffect(() => {
    // Создаем WebSocket только если еще не создан и не в процессе создания
    if (!wsRef.current && !isConnecting.current) {
      isConnecting.current = true;
      wsRef.current = new WebSocket(
        "ws://80.253.19.93:8000/api/v2/websocket/ws/spectator"
      );

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "question") {
          // Закрываем соединение перед переходом
          if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
          }
          navigate("/projector", { state: { data: data } });
        }
      };

      wsRef.current.onclose = () => {
        isConnecting.current = false;
      };
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      isConnecting.current = false;
    };
  }, [navigate]);

  return <div className={styles.window}></div>;
}

export default ScreenSaver;
