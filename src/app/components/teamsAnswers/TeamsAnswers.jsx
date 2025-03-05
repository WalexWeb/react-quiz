import styles from "./TeamsAnswers.module.scss";
import { useQuery } from "react-query";
import { instance } from "../../../api/instance";
import { ToastContainer } from "react-toastify";

function TeamsAnswers({ question, answerImage }) {
  // Получение всех ответов пользователей и времени ответа
  const fetchAnswers = async () => {
    try {
      const data = await instance.get(
        `/answers/question/${encodeURIComponent(question)}`
      );
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
    answer_at: a.answer_at,
    question: a.question,
    username: a.username,
    answer: a.answer,
    id: a.id,
  }));

  console.log(formattedAnswers);
  return (
    <div className={styles.example}>
      <table className={styles.rating}>
        <thead>
          <tr>
            <th>Команда</th>
            <th>Ответ</th>
          </tr>
        </thead>
        <tbody>
          {formattedAnswers.map((answer, index) => (
            <tr key={index}>
              <td>{answer.username}</td>
              <td>{answer.answer}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
