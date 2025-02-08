import styles from "./TeamsAnswers.module.scss";
import { useQuery } from "react-query";
import { instance } from "../../../api/instance";
import CorrectAnswerButton from "../correctAnswerButton/CorrectAnswerButton";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";

function TeamsAnswers({ questionId }) {
  // Получение всех ответов пользователей и времени ответа
  const fetchAnswers = async () => {
    try {
      const data = await instance.get(`/answers/question/${questionId}`);
      return data.data;
    } catch (error) {
      console.log(error.message);
    }
  };
  const { data: answers, isLoading } = useQuery(["answers"], fetchAnswers);
  if (isLoading) {
    return <h1>Загрузка...</h1>;
  }

  // Форматируем
  const formattedAnswers = answers.map((a) => ({
    answer: a.answer,
    user_id: a.user_id,
    question_id: a.question_id,
    answer_at: a.answer_at,
  }));

  function handleClick(e) {
    e.preventDefault();
  }

  return (
    <div>
      <table className={styles.rating}>
        <thead>
          <tr>
            <th>#</th>
            <th>Время ответа</th>
            <th>Ответ</th>
          </tr>
        </thead>
        <tbody>
          {formattedAnswers.map((answer, index) => (
            <tr key={answer.answer_at}>
              <th>{index + 1}</th>
              <td>{answer.answer_at}</td>
              <td>{answer.answer}</td>
              <td>
                <CorrectAnswerButton
                  onClick={handleClick}
                  userId={answer.user_id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
export default TeamsAnswers;
