import styles from "./Projector.module.scss";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import QuestionWheel from "../QuestionWheel/QuestionWheel";
import React, { useState, useEffect, useCallback, useRef } from "react";
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

  useEffect(() => {
    mainAudioRef.current = new Audio("/timer.mp3");
    mainAudioRef.current.volume = 0.5;

    return () => {
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
        mainAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!timer && mainAudioRef.current) {
      mainAudioRef.current.pause();
      mainAudioRef.current.currentTime = 0;
    }
  }, [timer, question]);

  const handleTimerAudio = (second) => {
    if (!audioEnabled) {
      try {
        mainAudioRef.current.play().then(() => {
          mainAudioRef.current.pause();
          setAudioEnabled(true);
        });
      } catch (error) {
        console.error("Error enabling audio:", error);
      }
      return;
    }

    if (second === 40 && mainAudioRef.current) {
      mainAudioRef.current.currentTime = 0;
      mainAudioRef.current.play();
    }
  };

  const connectWebSocket = useCallback(() => {
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
              setShowWheel(true);
              prevQuestionRef.current = data.content;

              setPendingQuestion(data);
            } else {
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

      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket();
      }, 2000);
    }
  }, [navigate]);

  useEffect(() => {
    connectWebSocket();

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
    handleTimerAudio(second);
  };

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
                  src={answerImage}
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
