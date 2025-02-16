import styles from "./Projector.module.scss";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Projector() {
  document.title = "Викторина | Проектор";

  const [seconds, setSeconds] = useState(0);
  const [newSeconds, setNewSeconds] = useState(null)
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [chapter, setChapter] = useState('');
  const [timer, setTimer] = useState(null)
  const [questionImage, setQuestionImage] = useState('');
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isConnecting = useRef(false);

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
      const websocket = new WebSocket("ws://80.253.19.93:8000/api/v2/websocket/ws/spectator");

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
          console.log(data)
          if (data.type === "rating") {
            navigate("/rating", { state: { data: data } });
          } else if (data.type === "answers") {
            navigate("/jury", { state: { data: data } });
          } else if (data.type === "question") {
            setQuestion(data.content);
            setChapter(data.section);

            const timerDuration = 40;
            setNewSeconds(timerDuration);
            localStorage.setItem('answerTimerSeconds', timerDuration);
            setTimer(data.timer)
            if (data.question_image) {
              const imagePath = `http://80.253.19.93:8000/static/images/${data.question_image}`
;
              setQuestionImage(imagePath);
            } else {
              setQuestionImage("");
            }
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
  };
console.log(timer)
  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <h1 className={styles.chapter}>{chapter || 'Ожидайте раздел'}</h1>
        <div className={styles.timer}>
        {timer && <AnswerTimer
            time={extractTime}
            duration={40}
            onTimeUp={handleTimeUp}
            question={question}
          />}
        </div>
        <p className={styles.question}>{question || "Ожидайте вопрос"}</p>
      </div>
      <div className={styles.container}>
        {questionImage ? (
          <img 
            src={questionImage} 
            className={styles.image} 
            alt="Изображение к вопросу"
            onError={(e) => {
              console.error("Failed to load image:", questionImage);
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className={styles.placeholder}>
            Изображение появится здесь
          </div>
        )}
      </div>
    </div>
  );
}

export default Projector;
