import styles from "./Answers.module.scss";
import AnswersTable from "../../components/answersTable/AnswersTable";
import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { instance } from "../../../api/instance";

function Answers() {
  const [questionId, setQuestionId] = useState(null);
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isConnecting = useRef(false);

  // Получение правильного ответа
  const { data: questionData } = useQuery(
    ["question", questionId],
    async () => {
      if (!questionId) return null;
      const response = await instance.get(`/questions/${questionId}`);
      return response.data;
    },
    {
      enabled: !!questionId,
      onSuccess: (data) => {
        if (data?.correct_answer) {
          setCorrectAnswer(data.correct_answer);
        }
      },
    }
  );

  // Функция создания WebSocket соединения
  const createWebSocket = useCallback(() => {
    if (isConnecting.current) {
      return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      isConnecting.current = true;
      const newWs = new WebSocket(
        "ws://10.10.0.88:8000/api/v2/websocket/ws/spectator"
      );

      newWs.onopen = () => {
        isConnecting.current = false;
        wsRef.current = newWs;
      };

      newWs.onclose = () => {
        wsRef.current = null;
        isConnecting.current = false;
        
        reconnectTimeoutRef.current = setTimeout(() => {
          createWebSocket();
        }, 3000);
      };

      newWs.onmessage = (event) => {
        if (event.data === "clear_storage") {
          localStorage.clear();
          location.reload();
          return;
        }

        try {
          const data = JSON.parse(event.data);

          if (data.type === "question") {
            // Получаем данные из сообщения
            const content = data.content || data.text;
            const answer = data.answer;

            // Обновляем состояние
            if (content) {
              setQuestion(content);
              localStorage.setItem("question", content);
            }
            if (answer) {
              setCorrectAnswer(answer);
            }
          }
        } catch (error) {
          // Если не удалось распарсить JSON, проверяем не текстовый ли это вопрос
          console.error("Error parsing WebSocket message:", error);
        }
      };
      newWs.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast.error("Ошибка подключения к серверу");
      };

      return newWs;
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      isConnecting.current = false;
      
      reconnectTimeoutRef.current = setTimeout(() => {
        createWebSocket();
      }, 3000);
    }
  }, []);

  useEffect(() => {
    createWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [createWebSocket]);

  return (
    <div className={styles.window}>
      <title>Викторина | Оценка ответов</title>
      <div className={styles.header}>
        <h1 className={styles.chapter}>Ответы участников</h1>
        <p className={styles.answer}>Вопрос: {question}</p>
        <p className={styles.answer}>
          Правильный ответ на вопрос: {correctAnswer}
        </p>
      </div>
      <AnswersTable question={localStorage.getItem("question")} />
    </div>
  );
}

export default Answers;