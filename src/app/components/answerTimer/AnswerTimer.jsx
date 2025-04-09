import styles from "./AnswerTimer.module.scss";
import { useEffect, useRef, useState } from "react";

function AnswerTimer({ duration, onTimeUp, time, question }) {
  console.log("AnswerTimer: получена длительность таймера:", duration);
  
  const [seconds, setSeconds] = useState(() => {
    const storedSeconds = localStorage.getItem('answerTimerSeconds');
    console.log("AnswerTimer: сохраненное значение секунд:", storedSeconds);
    return storedSeconds ? parseInt(storedSeconds, 10) : duration;
  });
  const [progressLoaded, setProgressLoaded] = useState(0);
  const intervalRef = useRef();
  const prevQuestionRef = useRef(question);
  const prevDurationRef = useRef(duration);

  // Эффект для сброса таймера при изменении вопроса или длительности
  useEffect(() => {
    console.log("AnswerTimer: проверка изменения вопроса или длительности");
    console.log("AnswerTimer: текущий вопрос:", question, "предыдущий вопрос:", prevQuestionRef.current);
    console.log("AnswerTimer: текущая длительность:", duration, "предыдущая длительность:", prevDurationRef.current);
    
    if ((prevQuestionRef.current !== question && question) || 
        (prevDurationRef.current !== duration && duration)) {
      console.log("AnswerTimer: сброс таймера на новую длительность:", duration);
      setSeconds(duration);
      localStorage.setItem('answerTimerSeconds', duration.toString());
      prevQuestionRef.current = question;
      prevDurationRef.current = duration;
    }
  }, [question, duration]);

  // Основной таймер
  useEffect(() => {
    console.log("AnswerTimer: запуск таймера, текущие секунды:", seconds);
    if (seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          localStorage.setItem('answerTimerSeconds', newSeconds.toString());
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
      localStorage.setItem('answerTimerSeconds', '0');
      setTimeout(() => {
        onTimeUp();
      }, 1000);
    }
  }, [seconds, duration, time, onTimeUp]);

  return (
    <div className={styles.timer}>
      <p>{seconds}</p>
      <div
        style={{ width: `${progressLoaded}%` }}
        className={styles.progress}
      ></div>
    </div>
  );
}

export default AnswerTimer;
