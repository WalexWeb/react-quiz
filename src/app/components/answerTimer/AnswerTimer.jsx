import styles from "./AnswerTimer.module.scss";
import { useEffect, useRef, useState } from "react";

function AnswerTimer({ duration, onTimeUp, time }) {
  const [seconds, setSeconds] = useState(duration);
  const [progressLoaded, setProgressLoaded] = useState(0);
  const intervalRef = useRef();

  if (seconds !== null) {
      // Таймер
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
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
