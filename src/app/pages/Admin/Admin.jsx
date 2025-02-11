import styles from "./Admin.module.scss";
import Table from "../../components/table/Table";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import { useState } from "react";
import Button from "../../components/button/Button";

function Admin() {
  document.title = "Викторина | Панель администратора";

  const [seconds, setSeconds] = useState(null);

  const handleTimeUp = () => {};

  // Извлекаем время из таймера
  const extractTime = (second) => {
    setSeconds(second);
  };

  function startGame() {
    fetch("http://80.253.19.93:5000/admin/start", { method: "POST" });
  }
  function nextQuestion() {
    fetch("http://80.253.19.93:5000/admin/next", { method: "POST" });
  }
  function stopGame() {
    fetch("http://80.253.19.93:5000/admin/stop", { method: "POST" });
  }
  function showRating() {
    fetch("http://80.253.19.93:5000/admin/show_rating", { method: "POST" });
  }
  function showQuestion() {
    fetch("http://80.253.19.93:5000/admin/show_question", { method: "POST" });
  }

  return (
    <div className={styles.window}>
      {/* Рейтинг */}
      <div className={styles.rating}>
        <Table />
      </div>

      {/* Выбор вопроса */}
      <div className={styles.question}>
        <h1>Выбор вопроса</h1>
        <Button onClick={startGame}>Начать игру</Button>
        <Button onClick={nextQuestion}>Следующий вопрос</Button>
        <Button onClick={stopGame}>Закончить игру</Button>
      </div>

      {/* Проектор */}
      <div className={styles.projector}>
        <h1>Проектор</h1>
        <Button onClick={showRating}>Показать рейтинг</Button>
        <Button onClick={showQuestion}>Показать вопрос</Button>
      </div>

      {/* Таймер */}
      <div className={styles.timer}>
        <h1>Настройки таймера</h1>
        <p>До конца раунда: </p>
        <div className={styles.time}>
          <AnswerTimer
            time={extractTime}
            duration={1800}
            onTimeUp={handleTimeUp}
          />
        </div>
      </div>
    </div>
  );
}

export default Admin;
