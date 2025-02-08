import styles from "./Jury.module.scss";
import TeamsAnswers from "../../components/teamsAnswers/TeamsAnswers";

function Jury() {
  document.title = "Викторина | Просмотр ответов";

  return (
    <div className={styles.window}>
      <h1 className={styles.header}>Ответы участников</h1>
      <p className={styles.answer}>Правильный ответ на вопрос: {}</p>
      <TeamsAnswers questionId={1} />
    </div>
  );
}

export default Jury;
