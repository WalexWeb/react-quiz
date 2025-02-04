import styles from "./Projector.module.scss";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import image from "../../../images/Pobeda80_cityformat_1_preview.jpg";

function Projector() {
  document.title = "Викторина | Проектор";

  const handleTimeUp = () => {};

  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <h1 className={styles.chapter}>Раздел</h1>
        <div className={styles.timer}>
          <AnswerTimer duration={60} onTimeUp={handleTimeUp} />
        </div>
        <p className={styles.question}>Вопрос</p>
      </div>
      <div className={styles.container}>
        <img src={image} className={styles.image} />
      </div>
    </div>
  );
}

export default Projector;
