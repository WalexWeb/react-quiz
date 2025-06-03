import styles from "./Rating.module.scss";
import Table from "../../components/table/Table";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import { getWebSocketUrl } from "../../../api/websocketConfig";

function Rating() {
  const navigate = useNavigate();
  const location = useLocation();
  const wsRef = useRef(null);
  const isConnecting = useRef(false);

  useEffect(() => {
    if (!wsRef.current && !isConnecting.current) {
      isConnecting.current = true;
      wsRef.current = new WebSocket(getWebSocketUrl("/ws/spectator"));

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "question") {
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

  return (
    <div className={styles.window}>
      <title>Викторина | Рейтинг</title>
      <h1 className={styles.header}>Рейтинг участников</h1>
      <p className={styles.caption}>Рейтинг по количеству набранных баллов</p>
      <div>
        <Table />
      </div>
    </div>
  );
}

export default Rating;
