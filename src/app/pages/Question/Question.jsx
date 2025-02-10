import styles from "./Question.module.scss";
import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import { ToastContainer, toast } from "react-toastify";
import { instance } from "../../../api/instance";
import { useQuery } from "react-query";

// Получение данных текущего пользователя
const fetchUser = async () => {
  try {
    const data = await instance.get("/users/me");
    return data.data;
  } catch (error) {
    console.log(error.message);
  }
};

function Question() {
  document.title = "Викторина";
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(null);

  const [question, setQuestion] = useState("");

  var ws;

  ws = new WebSocket("ws://localhost:8000/ws/player");
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "set_name", name: `${JSON.stringify(localStorage.getItem('playerName'))}` }));
  };
  ws.onmessage = (event) => {
    const data = event.data;
    if (data === "clear_storage") {
      localStorage.clear();
      location.reload();
      return;
    }

    setQuestion(data);
  };

  // Передаем данные в переменную user
  const { data: user } = useQuery(["user"], fetchUser);

  // Отправка ответа
  async function sendAnswerData(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await instance.post(
        `/answers/?question_id=${encodeURIComponent(
          question.id
        )}&user_id=${encodeURIComponent(user.id)}&answer=${encodeURIComponent(
          answer
        )}`
      );
      toast.success("Ответ отправлен!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Ошибка при отправке ответа";
      toast.error(errorMessage);
    }
  }

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
        <p className={styles.question}>{question || "Ждите начала игры..."}</p>
      </div>
      <form className={styles.form}>
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          type="text"
        />
        <Button
          disabled={(seconds === 0 ? true : false) || loading}
          onClick={sendAnswerData}
        >
          Отправить ответ
        </Button>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Question;
