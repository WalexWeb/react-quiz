import styles from "./Rating.module.scss";
import Table from "../../components/table/Table";
import { useNavigate } from "react-router-dom";

const fetchAnswers = async () => {
  try {
    const data = await instance.get("/answers/");
    return data.data;
  } catch (error) {
    console.log(error.message);
  }
};

function Rating() {
  document.title = "Викторина | Рейтинг";

  const navigate = useNavigate();

  const ws = new WebSocket("ws://80.253.19.93:8000/api/v2/websocket/ws/answers");

  function updateDisplay(data) {
    if (data.type === "question") {
      navigate("/projector", { state: { data: data } });
    }
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateDisplay(data);
  };

  // Сортировка по убыванию количества баллов
  const scoreSortedAnswers = formattedAnswers
    ? [...formattedUsers].sort((a, b) => b.score - a.score)
    : [];
  
  return (
<table className={styles.rating}>
      <thead>
        <tr>
          <th>#</th>
          <th>Команда</th>
          <th>Баллы</th>
        </tr>
      </thead>
      <tbody>
        {scoreSortedAnswers.map((user, index) => (
          <tr key={index}>
            <th>{index + 1}</th>
            <td>{user.username}</td>
            <td>{user.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Rating;
