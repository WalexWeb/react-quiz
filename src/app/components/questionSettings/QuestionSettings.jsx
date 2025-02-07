import styles from "./QuestionSettings.module.scss";

function QuestionSettings({
  selectedChapter,
  availableQuestions,
  isSpinning,
  isLoading,
  spinCount,
  onChange,
  spinWheel,
}) {
  return (
    <div className={styles.header}>
      <select
        className={styles.select}
        value={selectedChapter || ""}
        onChange={onChange}
        disabled={isLoading}
      >
        <option value="">Все разделы</option>
        <option value="1">Раздел 1</option>
        <option value="2">Раздел 2</option>
        <option value="3">Раздел 3</option>
        <option value="4">Раздел 4</option>
      </select>
      <div className={styles.stats}>
        <span>Осталось вопросов: {availableQuestions.length}</span>
        <span>Вопросов отвечено: {spinCount}</span>
      </div>
      {/* Кнопка вращения */}
      <button
        className={styles.button}
        onClick={spinWheel}
        disabled={isSpinning || availableQuestions.length === 0}
      >
        {isSpinning ? "Вращается..." : "Крутить колесо"}
      </button>
    </div>
  );
}

export default QuestionSettings;
