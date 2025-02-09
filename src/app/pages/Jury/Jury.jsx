import styles from "./Jury.module.scss";
import TeamsAnswers from "../../components/teamsAnswers/TeamsAnswers";

function Jury() {
  document.title = "Викторина | Просмотр ответов";

  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <h1 className={styles.chapter}>Ответы участников</h1>
        <p className={styles.answer}>Вопрос{}</p>
        <p className={styles.answer}>Правильный ответ на вопрос: {}</p>
      </div>
      <TeamsAnswers questionId={1} />
    </div>
  );
}

export default Jury;
