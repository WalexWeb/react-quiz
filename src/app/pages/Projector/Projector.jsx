import styles from "./Projector.module.scss";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Projector() {
  document.title = "Викторина | Проектор";

  const [seconds, setSeconds] = useState(0);
  const [question, setQuestion] = useState('')
  const navigate = useNavigate();

  const ws = new WebSocket("ws://localhost:8000/ws/spectator");

  function updateDisplay(data) {
    if (data.type === "rating") {
      navigate("/rating", { state: { data: data } });
    }
  }
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "set_name", name: "Stas" }));
  };
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateDisplay(data);
  };

    // Получение вопроса
    ws.onmessage = (event) => {
      const data = event.data;
  
      if (data === "clear_storage") {
        localStorage.clear();
        location.reload();
        return;
      }
      setQuestion(data);
    };

  const handleTimeUp = () => {};

  // Извлекаем время из таймера
  const extractTime = (second) => {
    setSeconds(second);
  };

  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <h1 className={styles.chapter}>Раздел</h1>
        <div className={styles.timer}>
          <AnswerTimer
            time={extractTime}
            duration={60}
            onTimeUp={handleTimeUp}
          />
        </div>
        <p className={styles.question}>{question || "Скоро начнем..."}</p>
      </div>
      <div className={styles.container}>
        <img src="" className={styles.image} />
      </div>
    </div>
  );
}

export default Projector;
