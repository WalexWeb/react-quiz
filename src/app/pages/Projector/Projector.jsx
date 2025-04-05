import styles from "./Projector.module.scss";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import QuestionWheel from "../QuestionWheel/QuestionWheel";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TeamsAnswers from "../../components/teamsAnswers/TeamsAnswers";
import { getWebSocketUrl } from "../../../api/websocketConfig";

function Projector() {
  const [seconds, setSeconds] = useState(0);
  const [newSeconds, setNewSeconds] = useState(null);
  const navigate = useNavigate();
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
    mainAudioRef.current = new Audio("/timer.mp3"); // Основная музыка таймера
    finalAudioRef.current = new Audio("/final.mp3"); // Музыка последних секунд

    mainAudioRef.current.volume = 0.5;
    finalAudioRef.current.volume = 0.5;

    return () => {
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
        mainAudioRef.current = null;
      }
      if (finalAudioRef.current) {
        finalAudioRef.current.pause();
        finalAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!timer) {
      // Если таймер выключен, останавливаем все аудио
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
        mainAudioRef.current.currentTime = 0;
      }
      if (finalAudioRef.current) {
        finalAudioRef.current.pause();
        finalAudioRef.current.currentTime = 0;
      }
    }
  }, [timer, question]);

  // Функция для управления аудио таймера
  const handleTimerAudio = (second) => {
    if (!audioEnabled) {
      // Пробуем включить аудио при первом тике таймера
      try {
        mainAudioRef.current.play().then(() => {
          mainAudioRef.current.pause();
          finalAudioRef.current.play().then(() => {
            finalAudioRef.current.pause();
            setAudioEnabled(true);
          });
        });
      } catch (error) {
        console.error("Error enabling audio:", error);
      }
      return;
    }

    if (second <= 2) {
      // Последние 2 секунды
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
        mainAudioRef.current.currentTime = 0;
      }
      if (finalAudioRef.current) {
        finalAudioRef.current.currentTime = 0;
        finalAudioRef.current.play();
      }
    } else if (second === 40) {
      // Начало таймера
      if (finalAudioRef.current) {
        finalAudioRef.current.pause();
        finalAudioRef.current.currentTime = 0;
      }
      if (mainAudioRef.current) {
        mainAudioRef.current.currentTime = 0;
        mainAudioRef.current.play();
      }
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
          console.log(data);
          if (data.type === "rating") {
            navigate("/rating", { state: { data: data } });
          } else if (data.type === "question") {
            if (data.content !== prevQuestionRef.current) {
              setShowWheel(true);
              prevQuestionRef.current = data.content; // Сохраняем текущий вопрос

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
              }
              setShowAnswer(data.show_answer);
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

  const handleTimeUp = () => {};

  const extractTime = (second) => {
    setSeconds(second);
    handleTimerAudio(second);
  };

  console.log(correctAnswer);

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
            const timerDuration = 40;
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
                  duration={40}
                  onTimeUp={handleTimeUp}
                  question={question}
                />
              )}
            </div>
            {!showAnswer && (
              <p className={styles.question}>{question || "Ожидайте вопрос"}</p>
            )}
          </div>
          {showAnswer && (
            <div className={styles.correctAnswer}>
              <div className={styles.correctAnswer__header}>
                <div className={styles.answer}>{correctAnswer}</div>
                <TeamsAnswers className={styles.answers} question={question} />
              </div>
              <div className={styles.answerImageContainer}>
                <img
                  src={answerImage}
                  className={styles.image}
                  alt="Изображение к вопросу"
                  onError={(e) => {
                    console.error("Failed to load image:", answerImage);
                    e.target.style.display = "none";
                  }}
                />
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
