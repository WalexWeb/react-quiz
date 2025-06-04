import styles from "./TeamsAnswers.module.scss";
import { useQuery } from "react-query";
import { instance } from "../../../api/instance";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";

function TeamsAnswers({ question }) {
  const [correctPlayers, setCorrectPlayers] = useState([]);

  // Функция для получения правильных ответов
  const fetchCorrectPlayers = async () => {
    try {
      const response = await axios.post(
        "http://0.0.0.0:8000/api/v2/websocket/get_correct_player"
      );

      return response.data.users;
    } catch (error) {
      console.log("Error fetching correct players:", error.message);
      return [];
    }
  };

  // Функция для получения всех ответов
  const fetchAnswers = async () => {
    try {
      const data = await instance.get(
        `/answers/question/${encodeURIComponent(question)}`
      );
      return data.data;
    } catch (error) {
      console.log(error.message);
      return [];
    }
  };

  // Запрос для правильных игроков
  const { data: correctPlayersData } = useQuery(
    ["correctPlayers"],
    fetchCorrectPlayers,
    {
      refetchInterval: 3000,
    }
  );

  // Запрос для всех ответов
  const { data: answers, isLoading } = useQuery(
    ["answers", question],
    fetchAnswers,
    {
      refetchInterval: 3000,
    }
  );

  useEffect(() => {
    if (correctPlayersData) {
      // Убедимся, что сохраняем массив
      setCorrectPlayers(
        Array.isArray(correctPlayersData) ? correctPlayersData : []
      );
    }
  }, [correctPlayersData]);

  if (isLoading) {
    return <h1>Загрузка...</h1>;
  }

  // Проверяем, что answers существует и является массивом
  const safeAnswers = Array.isArray(answers) ? answers : [];

  const formattedAnswers = safeAnswers.map((a) => ({
    answer_at: a.answer_at,
    question: a.question,
    username: a.username,
    answer: a.answer,
    id: a.id,
    isCorrect: correctPlayers.includes(a.username),
  }));

  return (
    <div className={styles.example}>
      <table className={styles.rating}>
        <thead></thead>
        <tbody>
          {formattedAnswers.map((answer, index) => (
            <tr key={index} className={answer.isCorrect ? styles.correct : ""}>
              <td>{answer.username}</td>
              <td>{answer.answer}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}

export default TeamsAnswers;
