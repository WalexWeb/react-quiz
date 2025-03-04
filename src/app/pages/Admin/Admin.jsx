import styles from "./Admin.module.scss";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import { useState } from "react";
import axios from "axios";

function Admin() {
  const [section, setSection] = useState("");

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
  function nextSection() {
    fetch("http://80.253.19.93:8000/api/v2/websocket/admin/next-section", {
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
  function clearRedis() {
    fetch("http://80.253.19.93:8000/api/v2/websocket/admin/clear-redis", {
      method: "POST",
    });
  }
  function startCaptainRound() {
    axios.post(
      "http://80.253.19.93:8000/api/v2/websocket/admin/update_sections",
      [section]
    );
  }

  return (
    <div className={styles.window}>
      <title>Викторина | Панель администратора</title>
      {/* Настройки */}
      <div className={styles.settings}>
        <Button onClick={clearRedis}>Очистить редис</Button>
        <Input
          value={section}
          onChange={(e) => setSection(e.target.value)}
          type="text"
        />
        <Button onClick={startCaptainRound}>Начать</Button>
      </div>

      {/* Выбор вопроса */}
      <div className={styles.question}>
        <h1>Выбор вопроса</h1>
        <Button onClick={startGame}>Начать игру</Button>
        <Button onClick={nextQuestion}>Следующий вопрос</Button>
        <Button onClick={nextSection}>Следующий раздел</Button>
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
