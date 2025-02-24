import styles from "./Rating.module.scss";
import Table from "../../components/table/Table";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";

function Rating() {
  const navigate = useNavigate();
  const wsRef = useRef(null);

  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = new WebSocket(
        "ws://80.253.19.93:8000/api/v2/websocket/ws/spectator"
      );

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "question") {
          navigate("/projector", { state: { data: data } });
        }
      };
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
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
