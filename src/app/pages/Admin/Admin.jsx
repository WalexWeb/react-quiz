import styles from "./Admin.module.scss";
import Button from "../../components/button/Button";
import { useState } from "react";
import { m } from "framer-motion";
import { getAdminWebSocketUrl } from "../../../api/websocketConfig";

const BASE_URL = getAdminWebSocketUrl("/admin");

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
        <Button onClick={showQuestion}>Показать вопрос</Button>
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
