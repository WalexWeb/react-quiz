import Table from "../../components/Table/Table";
import styles from "./Rating.module.scss";

function Rating() {
  document.title = "Викторина | Рейтинг";
  return (
    <div className={styles.window}>
      <h1 className={styles.header}>Рейтинг участников</h1>
      <p className={styles.caption}>Рейтинг по количеству набранных баллов</p>
      <div>
        <Table />
      </div>
    </div>
  );
}

export default Rating;
