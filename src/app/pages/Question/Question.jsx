import styles from "./Question.module.scss";
import { useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import QuestionWheel from "../QuestionWheel/QuestionWheel";
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
  const [chapter, setChapter] = useState("");
  const [newSeconds, setNewSeconds] = useState(null);
  const [timer, setTimer] = useState(null);
  const [showWheel, setShowWheel] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState(null);

  var ws;

  ws = new WebSocket("ws://80.253.19.93:8000/api/v2/websocket/ws/player");
  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        type: "set_name",
        name: `${JSON.stringify(localStorage.getItem("playerName"))}`,
      })
    );
  };
  ws.onmessage = (event) => {
    const state = event.data;
    if (state === "clear_storage") {
      localStorage.clear();
      location.reload();
      return;
    }
    const data = JSON.parse(event.data);
    // Устанавливаем фиксированное значение для таймера
    const timerDuration = 40;
    setNewSeconds(timerDuration);
    setChapter(data.section);
    setQuestion(data.text);
    setTimer(data.timer);
    setLoading(false);

    localStorage.setItem("loading", false);
    localStorage.setItem("answerTimerSeconds", timerDuration);
    localStorage.setItem("chapter", data.section);
    localStorage.setItem("question", data.text);

    if (data.timer === false && data.answer !== null) {
      setPendingQuestion(data);
      setShowWheel(true);
    }
  };

  // Передаем данные в переменную user
  const { data: user } = useQuery(["user"], fetchUser);

  // Отправка ответа
  async function sendAnswerData(e) {
    e.preventDefault();
    if (timer) {
      setLoading(true);
    }
    localStorage.setItem("loading", false);

    try {
      await instance.post(
        `/answers/?question=${encodeURIComponent(
          question
        )}&username=${encodeURIComponent(
          user.username
        )}&answer=${encodeURIComponent(answer)}`
      );
      toast.success("Ответ отправлен!");
      setAnswer("");
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
  console.log(timer);
  return (
    <div className={styles.window}>
      <QuestionWheel
        isVisible={showWheel}
        onAnimationComplete={() => {
          // После завершения анимации обновляем данные
          if (pendingQuestion) {
            const timerDuration = 40;
            setNewSeconds(timerDuration);
            setChapter(pendingQuestion.section);
            setQuestion(pendingQuestion.text);
            setTimer(pendingQuestion.timer);
            localStorage.setItem("answerTimerSeconds", timerDuration);
            localStorage.setItem("chapter", pendingQuestion.section);
            localStorage.setItem("question", pendingQuestion.text);
            setPendingQuestion(null);
          }
          setShowWheel(false);
        }}
        animationSpeed={4}
      />
      {!showWheel && (
        <>
          <div className={styles.header}>
            <h1 className={styles.chapter}>
              {localStorage.getItem("chapter") || "Ожидайте раздел"}
            </h1>
            <div className={styles.timer}>
              {timer && (
                <AnswerTimer
                  time={extractTime}
                  duration={40}
                  onTimeUp={handleTimeUp}
                  question={question}
                />
              )}
            </div>
            <p className={styles.question}>
              {localStorage.getItem("question") || "Ждите начала игры..."}
            </p>
          </div>
          <form className={styles.form}>
            <Input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              type="text"
            />
            {timer && (
              <Button
                disabled={(seconds === 0 ? true : false) || loading}
                onClick={sendAnswerData}
              >
                Отправить ответ
              </Button>
            )}
          </form>
        </>
      )}
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
