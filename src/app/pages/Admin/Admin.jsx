import styles from "./Admin.module.scss";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import { useState } from "react";
import Button from "../../components/button/Button";

function Admin() {
  function startGame() {
    fetch("http://80.253.19.93:8000/api/v2/websocket/admin/start", {
      method: "POST",
    });
  }
  function nextQuestion() {
    fetch("http://80.253.19.93:8000/api/v2/websocket/admin/next", {
      method: "POST",
    });
  }
  function stopGame() {
    fetch("http://80.253.19.93:8000/api/v2/websocket/admin/stop", {
      method: "POST",
    });
  }
  function showRating() {
    fetch("http://80.253.19.93:8000/api/v2/websocket/admin/show_rating", {
      method: "POST",
    });
  }
  function showQuestion() {
    fetch("http://80.253.19.93:8000/api/v2/websocket/admin/show_question", {
      method: "POST",
    });
  }
  function showAnswers() {
    fetch("http://80.253.19.93:8000/api/v2/websocket/admin/show_answer", {
      method: "POST",
    });
  }
  function startTimer() {
    fetch("http://80.253.19.93:8000/api/v2/websocket/admin/start_timer", {
      method: "POST",
    });
  }

  function showScreenSaver() {
    fetch("", { method: "POST" });
  }

  return (
    <div className={styles.window}>
      <title>Викторина | Панель администратора</title>

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
        <Button onClick={showScreenSaver}>Показать заставку</Button>
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
