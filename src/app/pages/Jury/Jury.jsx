import styles from "./Jury.module.scss";
import TeamsAnswers from "../../components/teamsAnswers/TeamsAnswers";

function Jury() {
  document.title = "Викторина | Просмотр ответов";


  
  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <h1 className={styles.chapter}>Ответы участников</h1>
      </div>
      <TeamsAnswers questionId={63} />
    </div>
  );
}

export default Jury;
