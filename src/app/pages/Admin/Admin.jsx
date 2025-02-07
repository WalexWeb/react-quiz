import styles from "./Admin.module.scss";
import Table from "../../components/table/Table";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import { useState } from "react";
import QuestionSettings from "../../components/questionSettings/QuestionSettings";

function Admin() {
  document.title = "Викторина | Панель администратора";

  const [seconds, setSeconds] = useState(0)

  const handleTimeUp = () => {};

  // Извлекаем время из таймера
  const extractTime = (second) => {
    setSeconds(second);
  };

  return (
    <div className={styles.window}>
      {/* Рейтинг */}
      <div className={styles.rating}>
        <Table />
      </div>

      {/* Выбор вопроса */}
      <div className={styles.question}>
        <h1>Выбор вопроса</h1>
        {/* <QuestionSettings /> */}
      </div>

      {/* Проектор */}
      <div className={styles.projector}>
        <h1>Проектор</h1>
      </div>

      {/* Таймер */}
      <div className={styles.timer}>
        <h1>Настройки таймера</h1>
        <p>До конца раунда: </p>
        <div className={styles.time}>
          <AnswerTimer time={extractTime} duration={1800} onTimeUp={handleTimeUp} />
        </div>
      </div>
    </div>
  );
}

export default Admin;
