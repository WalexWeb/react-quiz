import styles from "./Answers.module.scss";
import AnswersTable from '../../components/answersTable/AnswersTable'
import { useState, useCallback, useEffect } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { instance } from "../../../api/instance";

function Answers() {
  document.title = "Викторина | Оценка ответов";

  const [questionId, setQuestionId] = useState(null);
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
setQuestion(content)        
localStorage.setItem('question', content)  };
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

    newWs.onclose = () => {
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
  console.log(question)

  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <h1 className={styles.chapter}>Ответы участников</h1>
        <p className={styles.answer}>Вопрос: {question}</p>
        <p className={styles.answer}>Правильный ответ на вопрос: {correctAnswer}</p>
      </div>
      <AnswersTable question={localStorage.getItem('question')} />
    </div>
  );
}

export default Answers;
