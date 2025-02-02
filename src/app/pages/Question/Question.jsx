import styles from "./Question.module.scss";
import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";

function Question() {
  const [answer, setAnswer] = useState("");
  const [seconds, setSeconds] = useState(0);

  function sendAnswerData(e) {
    e.preventDefault();
  }

  const handleTimeUp = () => {};

  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <h1 className={styles.chapter}>Раздел</h1>
        <AnswerTimer duration={60} onTimeUp={handleTimeUp} />
        <p className={styles.question}>Вопрос</p>
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
