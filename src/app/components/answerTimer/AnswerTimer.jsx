import styles from "./AnswerTimer.module.scss";
import { useEffect, useRef, useState } from "react";

function AnswerTimer({ duration, onTimeUp, time, question }) {
  const [seconds, setSeconds] = useState(() => {
    const storedSeconds = localStorage.getItem("answerTimerSeconds");
    return storedSeconds ? parseInt(storedSeconds) : duration;
  });
  const [progressLoaded, setProgressLoaded] = useState(0);
  const intervalRef = useRef();
  const prevQuestionRef = useRef(question);

  // Эффект для сброса таймера при изменении вопроса
  useEffect(() => {
    if (prevQuestionRef.current !== question && question) {
      setSeconds(duration);
      localStorage.setItem("answerTimerSeconds", duration.toString());
      prevQuestionRef.current = question;
    }
  }, [question, duration]);

  // Основной таймер
  useEffect(() => {
    if (seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          localStorage.setItem("answerTimerSeconds", newSeconds.toString());
          return newSeconds;
        });
      }, 1000);

      return () => {
        clearInterval(intervalRef.current);
      };
    }
  }, [seconds]); // Перезапускаем эффект когда таймер изменяется

  // Обновление прогресса и проверка окончания времени
  useEffect(() => {
    setProgressLoaded((100 / duration) * seconds);
    time(seconds);

    if (seconds <= 0) {
      clearInterval(intervalRef.current);
      localStorage.setItem("answerTimerSeconds", "0");
      setTimeout(() => {
        onTimeUp();
      }, 1000);
    }
  }, [seconds, duration, time, onTimeUp]);

  return (
    <div className={styles.timer}>
      <p className={styles.seconds}>{seconds}</p>
      <div
        style={{ width: `${progressLoaded}%` }}
        className={styles.progress}
      ></div>
    </div>
  );
}

export default AnswerTimer;
