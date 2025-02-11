import styles from "./Projector.module.scss";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Projector() {
  document.title = "Викторина | Проектор";

  const [seconds, setSeconds] = useState(0);
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [chapter, setChapter] = useState('')


  const ws = new WebSocket("ws://80.253.19.93:5000/ws/spectator");

  function updateDisplay(data) {
    if (data.type === "rating") {
      navigate("/rating", { state: { data: data } });
    }
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateDisplay(data);
    setQuestion(data.content);
    setChapter(data.section)
  };

  const handleTimeUp = () => {};

  // Извлекаем время из таймера
  const extractTime = (second) => {
    setSeconds(second);
  };

  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <h1 className={styles.chapter}>{chapter || 'Ожидайте раздел'}</h1>
        <div className={styles.timer}>
          <AnswerTimer
            time={extractTime}
            duration={60}
            onTimeUp={handleTimeUp}
          />
        </div>
        <p className={styles.question}>{question || "Ожидайте вопрос"}</p>
      </div>
      <div className={styles.container}>
        <img src="" className={styles.image} />
      </div>
    </div>
  );
}

export default Projector;
