import styles from "./Rating.module.scss";
import Table from "../../components/table/Table";
import { useNavigate } from "react-router-dom";

function Rating() {
  const navigate = useNavigate();

  const ws = new WebSocket(
    "ws://80.253.19.93:8000/api/v2/websocket/ws/spectator"
  );

  function updateDisplay(data) {
    if (data.type === "question") {
      navigate("/projector", { state: { data: data } });
    }
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateDisplay(data);
  };

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
