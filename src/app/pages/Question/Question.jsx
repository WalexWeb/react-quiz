import styles from "./Question.module.scss";
import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import { useLocation, useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { useMutation } from "react-query";
import { instance } from "../../../api/instance";

function Question() {
  document.title = "Викторина";
  const location = useLocation();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const question = location.state?.question;

  useEffect(() => {
    if (!question) {
      navigate("/question-wheel");
    }
  }, [question, navigate]);

  function sendAnswerData(e) {
    e.preventDefault();
    setIsLoading(true);
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
        <p className={styles.question}>{question?.text || "Вопрос"}</p>
      </div>
      <form className={styles.form}>
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          type="text"
        />
        <Button
          disabled={(seconds === 0 ? true : false) || isLoading}
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
