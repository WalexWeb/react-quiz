import styles from "./TeamsAnswers.module.scss";
import { useQuery } from "react-query";
import { instance } from "../../../api/instance";

const fetchAnswers = async () => {
  try {
    const data = await instance.get("/answers/");
    return data.data;
  } catch (error) {
    console.log(error.message);
  }
};

function Table({ question }) {
  const { data: answers, isLoading } = useQuery(["answers"], fetchAnswers);
  if (isLoading) {
    return <h1>Загрузка...</h1>;
  }
  const formattedAnswers = answers.map((a) => ({
    answer: a.answer,
    user_id: a.user_id,
    question_id: a.question_id,
    answer_at: a.answer_at,
  }));

  return (
    <table className={styles.rating}>
      <p>Правильный ответ на вопрос: {question}</p>
      <thead>
        <tr>
          <th>#</th>
          <th>Ответ</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        {formattedAnswers.map((answer, index) => (
          <tr key={answer.answer_at}>
            <th>{index + 1}</th>
            <td>{answer.user_id}</td>
            <td>{answer.answer}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default Table;
