import styles from "./Jury.module.scss";
import TeamsAnswers from "../../components/teamsAnswers/TeamsAnswers";
import { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import { instance } from "../../../api/instance";
import { useQuery } from "react-query";

function Jury() {
  document.title = "Викторина | Просмотр ответов";
  const [questionId, setQuestionId] = useState(null);
  const [chapter, setChapter] = useState("");
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [ws, setWs] = useState(null);

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
      }
    }
  );

  // Функция создания WebSocket соединения
  const createWebSocket = useCallback(() => {
    const newWs = new WebSocket("ws://80.253.19.93:8000/api/v2/websocket/ws/spectator");

    newWs.onopen = () => {
      console.log("Jury WebSocket connected");
    };

    newWs.onmessage = (event) => {
      if (event.data === "clear_storage") {
        localStorage.clear();
        location.reload();
        return;
      }
      
      try {
        const data = JSON.parse(event.data);
        console.log("Jury received data:", data);

        if (data.type === "question") {
          // Получаем данные из сообщения
          const content = data.content || data.text;
          const section = data.section;
          const answer = data.answer;

          // Обновляем состояние
          if (content) setQuestion(content);
          if (section) setChapter(section);
          if (answer) {
            console.log("Setting correct answer:", answer);
            setCorrectAnswer(answer);
          }
          
        } else if (data.type === "rating") {
          // Для сообщений с рейтингом обновляем только раздел
          if (data.section) {
            setChapter(data.section);
          }
          // Очищаем вопрос и ответ при переходе к рейтингу
          setQuestion("");
          setCorrectAnswer("");
        }
      } catch (error) {
        // Если не удалось распарсить JSON, проверяем не текстовый ли это вопрос
        console.log("Received possible text question:", event.data);
        if (typeof event.data === "string" && !event.data.includes('"type":')) {
          setQuestion(event.data);
        } else {
          console.error("Error parsing WebSocket message:", error);
        }
      }
    };

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("Ошибка подключения к серверу");
    };

    newWs.onclose = () => {
      console.log("WebSocket disconnected. Reconnecting...");
      setTimeout(() => {
        setWs(createWebSocket());
      }, 3000);
    };

    return newWs;
  }, []);

  useEffect(() => {
    const websocket = createWebSocket();
    setWs(websocket);

    return () => {
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, [createWebSocket]);

  return (
    <div className={styles.window}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.chapterContainer}>
            <h2 className={styles.sectionTitle}>Текущий раздел:</h2>
            <h1 className={styles.chapter}>{chapter || 'Ожидайте раздел'}</h1>
          </div>

          {question && (
            <div className={styles.questionContainer}>
              <h2 className={styles.sectionTitle}>Вопрос:</h2>
              <div className={styles.question}>{question}</div>
              {correctAnswer && (
                <div className={styles.correctAnswer}>
                  <h2 className={styles.sectionTitle}>Правильный ответ:</h2>
                  <div className={styles.answer}>{correctAnswer}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.answersContainer}>
          <h2 className={styles.sectionTitle}>Ответы команд:</h2>
          {questionId && <TeamsAnswers questionId={questionId} key={questionId} />}
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Jury;
