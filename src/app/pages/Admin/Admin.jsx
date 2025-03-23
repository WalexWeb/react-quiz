import styles from "./Admin.module.scss";
import Button from "../../components/button/Button";
import { useState } from "react";
import { m } from "framer-motion";

const BASE_URL = "http://80.253.19.93:8000/api/v2/websocket/admin";

function Admin() {
  const [count, setCount] = useState(0);

  function startGame() {
    fetch(`${BASE_URL}/start`, {
      method: "POST",
    });
  }
  function nextQuestion() {
    fetch(`${BASE_URL}/next`, {
      method: "POST",
    });

    setCount((count) => count + 1);
  }
  function stopGame() {
    fetch(`${BASE_URL}/stop`, {
      method: "POST",
    });
  }
  function showRating() {
    fetch(`${BASE_URL}/show_rating`, {
      method: "POST",
    });
  }
  function showQuestion() {
    fetch(`${BASE_URL}/show_question`, {
      method: "POST",
    });
  }
  function showAnswers() {
    fetch(`${BASE_URL}/show_answer`, {
      method: "POST",
    });
  }
  function startTimer() {
    fetch(`${BASE_URL}/start_timer`, {
      method: "POST",
    });
  }

  function showScreenSaver() {
    fetch("", { method: "POST" });
  }

  return (
    <div className={styles.window}>
      <title>Викторина | Панель администратора</title>

      <div className={styles.rating}>
        <p className={styles.count}>Номер вопроса: {count}</p>
        <m.button
          onClick={() => setCount((count) => count + 1)}
          className={styles.count__btn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
        >
          +
        </m.button>
      </div>

      {/* Выбор вопроса */}
      <div className={styles.question}>
        <h1>Выбор вопроса</h1>
        <Button onClick={startGame}>Начать игру</Button>
        <m.button
          className={styles.next}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          onClick={nextQuestion}
        >
          Следующий вопрос
        </m.button>
        <Button onClick={stopGame}>Закончить игру</Button>
      </div>

      {/* Проектор */}
      <div className={styles.projector}>
        <h1>Проектор</h1>
        <m.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          className={styles.next}
          onClick={showQuestion}
        >
          Показать вопрос
        </m.button>
        <Button onClick={showRating}>Показать рейтинг</Button>
        <Button onClick={showAnswers}>Показать ответ на вопрос</Button>
      </div>

      {/* Таймер */}
      <div className={styles.timer}>
        <h1>Настройки таймера</h1>
        <Button onClick={startTimer}>Запуск таймера</Button>
        <div className={styles.time}></div>
      </div>
    </div>
  );
}

export default Admin;
