import styles from "./AnswerTimer.module.scss";
import { useEffect, useRef, useState } from "react";

function AnswerTimer({ duration, onTimeUp, time }) {
  const [seconds, setSeconds] = useState(() => {
    const storedSeconds = localStorage.getItem('answerTimerSeconds')
    return storedSeconds ? parseInt(storedSeconds, 10) : duration;
  })
  const [progressLoaded, setProgressLoaded] = useState(0);
  const intervalRef = useRef();

  if(seconds !== null) {
      // Таймер
      useEffect(() => {
        intervalRef.current = setInterval(() => {
          setSeconds((prevSeconds) => {
            const newSeconds = prevSeconds - 1;
            localStorage.setItem('answerTimerSeconds', newSeconds);
            return newSeconds;
          });
        }, 1000);
    
        return () => {
          clearInterval(intervalRef.current);
          localStorage.removeItem('answerTimerSeconds');
        };
      }, []);
    }

  // Заполнение контейнера таймера
  useEffect(() => {
    setProgressLoaded((100 / duration) * seconds);

    // Передаем секунды на уровень выше
    time(seconds);

    if (seconds === 0) {
      clearInterval(intervalRef.current);

      setTimeout(() => {
        onTimeUp(() => seconds);
      }, 1000);
    }
  }, [seconds]);

  return (
    <div className={styles.timer}>
      <p>{seconds < 10 ? "0" + seconds : seconds}</p>
      <div
        style={{ width: `${progressLoaded}%` }}
        className={styles.progress}
      ></div>
    </div>
  );
}

export default AnswerTimer;
