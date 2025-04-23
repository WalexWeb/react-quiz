import styles from "./Projector.module.scss";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import QuestionWheel from "../QuestionWheel/QuestionWheel";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TeamsAnswers from "../../components/teamsAnswers/TeamsAnswers";
import { getWebSocketUrl } from "../../../api/websocketConfig";

const useAudioPlayer = () => {
  const audioRefs = {
    main: useRef(null),
    timer40: useRef(null),
    timer10: useRef(null),
  };

  useEffect(() => {
    // Инициализация аудио элементов
    audioRefs.main.current = new Audio("/timer.mp3");
    audioRefs.timer40.current = new Audio("/timer.mp3");
    audioRefs.timer10.current = new Audio("/timer_10.mp3");

    // Установка громкости
    Object.values(audioRefs).forEach((ref) => {
      if (ref.current) ref.current.volume = 0.5;
    });

    return () => {
      // Очистка
      Object.values(audioRefs).forEach((ref) => {
        if (ref.current) {
          ref.current.pause();
          ref.current = null;
        }
      });
    };
  }, []);

  const playAudio = (type) => {
    const audio = audioRefs[type]?.current;
    if (!audio) return;

    // Останавливаем все другие аудио
    Object.entries(audioRefs).forEach(([key, ref]) => {
      if (key !== type && ref.current && !ref.current.paused) {
        ref.current.pause();
      }
    });

    // Воспроизводим выбранное аудио
    audio.currentTime = 0;
    audio.play().catch((e) => console.error(`Error playing ${type} audio:`, e));
  };

  return { playAudio };
};

function Projector() {
  const [seconds, setSeconds] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState("");
  const [newSeconds, setNewSeconds] = useState(null);
  const navigate = useNavigate();
  const timer40AudioRef = useRef(null); // Audio for 40 seconds
  const timer10AudioRef = useRef(null); // Audio for 10 seconds
  const [playedAudios, setPlayedAudios] = useState({
    timer40: false,
    timer10: false,
    main: false,
  });
  const [question, setQuestion] = useState("");
  const [chapter, setChapter] = useState("");
  const [timer, setTimer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(null);
  const [questionImage, setQuestionImage] = useState("");
  const [answerImage, setAnswerImage] = useState("");
  const [showWheel, setShowWheel] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState(null);
  const wsRef = useRef(null);
  const prevQuestionRef = useRef("");
  const reconnectTimeoutRef = useRef(null);
  const isConnecting = useRef(false);
  const mainAudioRef = useRef(null);
  const finalAudioRef = useRef(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");

  // Инициализация аудио элементов
  useEffect(() => {
    mainAudioRef.current = new Audio("/timer.mp3");
    mainAudioRef.current.volume = 0.5;

    timer40AudioRef.current = new Audio("/timer.mp3"); // Audio for 40 seconds
    timer40AudioRef.current.volume = 0.5;

    timer10AudioRef.current = new Audio("/timer_10.mp3"); // Audio for 10 seconds
    timer10AudioRef.current.volume = 0.5;

    return () => {
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
        mainAudioRef.current = null;
      }
      if (timer40AudioRef.current) {
        timer40AudioRef.current.pause();
        timer40AudioRef.current = null;
      }
      if (timer10AudioRef.current) {
        timer10AudioRef.current.pause();
        timer10AudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!timer && mainAudioRef.current) {
      mainAudioRef.current.pause();
      mainAudioRef.current.currentTime = 0;
    }
  }, [timer, question]);

  // Функция для управления аудио таймера
  const playedFlagsRef = useRef({ played40: false, played10: false });

  // Модифицированная функция handleTimerAudio
  const { playAudio } = useAudioPlayer();
  const [lastTriggeredSecond, setLastTriggeredSecond] = useState(null);

  // Обработчик таймера
  const handleTimerUpdate = (currentSecond) => {
    // Проверяем, нужно ли воспроизводить звук
    if (
      timerSeconds === 40 &&
      currentSecond === 40 &&
      lastTriggeredSecond !== 40
    ) {
      playAudio("timer40");
      setLastTriggeredSecond(40);
    } else if (
      timerSeconds === 10 &&
      currentSecond === 10 &&
      lastTriggeredSecond !== 10
    ) {
      playAudio("timer10");
      setLastTriggeredSecond(10);
    } else if (
      currentSecond === timerSeconds &&
      lastTriggeredSecond !== currentSecond
    ) {
      playAudio("main");
      setLastTriggeredSecond(currentSecond);
    }

    // Сбрасываем флаг, если вышли за границы
    if (currentSecond !== 40 && lastTriggeredSecond === 40) {
      setLastTriggeredSecond(null);
    }
    if (currentSecond !== 10 && lastTriggeredSecond === 10) {
      setLastTriggeredSecond(null);
    }
  };

  const connectWebSocket = useCallback(() => {
    // Если уже идет подключение, не создаем новое
    if (isConnecting.current) {
      return;
    }

    // Очищаем предыдущий таймаут
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      isConnecting.current = true;
      const websocket = new WebSocket(getWebSocketUrl("/ws/spectator"));

      websocket.onopen = () => {
        isConnecting.current = false;
        wsRef.current = websocket;
      };

      websocket.onclose = (event) => {
        wsRef.current = null;
        isConnecting.current = false;

        // Пытаемся переподключиться через 2 секунды
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 2000);
      };

      websocket.onerror = (error) => {
        console.error("Projector WebSocket error:", error);
        isConnecting.current = false;
      };

      websocket.onmessage = (event) => {
        try {
          if (event.data === "clear_storage") {
            localStorage.clear();
            location.reload();
            return;
          }

          const data = JSON.parse(event.data);
          if (data.type === "rating") {
            navigate("/rating", { state: { data: data } });
          } else if (data.type === "question") {
            if (data.content !== prevQuestionRef.current) {
              setAnswerImage(""); // <-- Очистка answerImage при смене вопроса
              setShowWheel(true);
              prevQuestionRef.current = data.content;
              setPendingQuestion(data);
            } else {
              // Если условия не выполняются, просто обновляем данные без анимации
              setQuestion(data.content);
              setChapter(data.section);
              setCorrectAnswer(data.answer);
              if (data.timer !== undefined) {
                setTimer(data.timer);
              }
              if (data.seconds !== undefined) {
                setNewSeconds(data.seconds);
              }
              if (data.show_answer !== undefined) {
                setShowAnswer(data.show_answer);
              }
              if (data.timer_seconds !== undefined) {
                console.log(data.timer_seconds);
                setTimerSeconds(data.timer_seconds);
                handleTimerUpdate(data.seconds);
              }
            }
          } else if (data.type === "screen") {
            navigate("/screen");
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      isConnecting.current = false;

      // Пытаемся переподключиться через 2 секунды
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket();
      }, 2000);
    }
  }, [navigate]);

  useEffect(() => {
    connectWebSocket();

    // Очистка при размонтировании
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  const handleTimeUp = () => {
    setTimer(null);
  };

  const extractTime = (second) => {
    setSeconds(second);
    handleTimerUpdate(second);
  };

console.log(answerImage)

  return (
    <div className={styles.window}>
      <title>Викторина | Проектор</title>
      <QuestionWheel
        isVisible={showWheel}
        onAnimationComplete={() => {
          if (pendingQuestion) {
            setQuestion(pendingQuestion.content);
            setChapter(pendingQuestion.section);
            setCorrectAnswer(pendingQuestion.answer);
            const timerDuration = timerSeconds;
            setNewSeconds(timerDuration);
            localStorage.setItem("answerTimerSeconds", timerDuration);
            setTimer(pendingQuestion.timer);
            setShowAnswer(pendingQuestion.show_answer);
            setQuestionImage(
              pendingQuestion.question_image
                ? `http://80.253.19.93:8000/static/images/${pendingQuestion.question_image}`
                : ""
            );
            setAnswerImage(
              pendingQuestion.answer_image
                ? `http://80.253.19.93:8000/static/images/${pendingQuestion.answer_image}`
                : ""
            );
            setPendingQuestion(null);
          }
          setShowWheel(false);
        }}
        animationSpeed={4}
      />
      {!showWheel && (
        <>
          <div className={styles.header}>
            <h1 className={styles.chapter}>{chapter || "Ожидайте раздел"}</h1>
            <div className={styles.timer}>
              {timer && (
                <AnswerTimer
                  time={extractTime}
                  duration={timerSeconds}
                  onTimeUp={handleTimeUp}
                  question={question}
                />
              )}
            </div>
            {!showAnswer && (
              <p className={styles.question}>
                {question
                  ? question.split(/\r?\n|\u000A/g).map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))
                  : "Ожидайте вопрос"}
              </p>
            )}
          </div>
          {showAnswer && (
            <div className={styles.correctAnswer}>
              <div className={styles.answer}>{correctAnswer}</div>
              <div className={styles.answerImageContainer}>
                <img
                  src="../../../../1_18_answer.jpg"
                  className={styles.image}
                  alt="Изображение к вопросу"
                  onError={(e) => {
                    console.error("Failed to load image:", answerImage);
                    e.target.style.display = "none";
                  }}
                />
                <div className={styles.correctAnswer__header}>
                  <TeamsAnswers
                    className={styles.answers}
                    question={question}
                  />
                </div>
              </div>
            </div>
          )}
          <div className={styles.container}>
            {!showAnswer && questionImage ? (
              <img
                src={questionImage}
                className={styles.image}
                alt="Изображение к вопросу"
                onError={(e) => {
                  console.error("Failed to load image:", questionImage);
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className={styles.placeholder}></div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Projector;
