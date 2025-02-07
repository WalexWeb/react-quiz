import styles from "./Projector.module.scss";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import { useState } from "react";

function Projector({question}) {
  document.title = "Викторина | Проектор";

  const [seconds, setSeconds] = useState(0);

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
        <p className={styles.question}>{question?.question || "Вопрос"}</p>
      </div>
      <div className={styles.container}>
        <img src="" className={styles.image} />
      </div>
    </div>
  );
}

export default Projector;
