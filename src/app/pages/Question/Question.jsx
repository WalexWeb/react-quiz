import styles from "./Question.module.scss";
import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import { useLocation, useNavigate } from "react-router";

function Question() {
  document.title = "Викторина";
  const location = useLocation();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");
  const [seconds, setSeconds] = useState(0);
  const question = location.state?.question;

  useEffect(() => {
    if (!question) {
      navigate("/wheel");
    }
  }, [question, navigate]);

  function sendAnswerData(e) {
    e.preventDefault();
  }

  const handleTimeUp = () => {};

  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <h1 className={styles.chapter}>Раздел</h1>
        <div className={styles.timer}>
          <AnswerTimer duration={60} onTimeUp={handleTimeUp} />
        </div>
        <p className={styles.question}>{question?.text || "Вопрос"}</p>
      </div>
      <form className={styles.form}>
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          type="text"
        />
        <Button onClick={sendAnswerData}>Отправить ответ</Button>
      </form>
    </div>
  );
}

export default Question;
