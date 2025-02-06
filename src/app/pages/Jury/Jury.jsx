import styles from "./Jury.module.scss";
import TeamsAnswers from "../../components/teamsAnswers/TeamsAnswers";

function Jury() {
  document.title = "Викторина | Просмотр ответов";

  return (
    <div className={styles.window}>
      <TeamsAnswers question={question} />
    </div>
  );
}

export default Jury;
