import styles from "./SelectedQuestion.module.scss";

function SelectedQuestion({ selectedQuestion }) {
  if (!selectedQuestion) return null;

  return (
    <div className={styles.selectedQuestion}>
      <div className={styles.questionContent}>
        <h2>Текущий вопрос:</h2>
        <div className={styles.questionText}>{selectedQuestion.question}</div>
        <div className={styles.chapterInfo}>{selectedQuestion.chapter}</div>
      </div>
    </div>
  );
}

export default SelectedQuestion;
