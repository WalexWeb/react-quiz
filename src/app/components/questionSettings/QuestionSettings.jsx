import styles from "./QuestionSettings.module.scss";

function QuestionSettings() {
  return (
    <div>
      {/* Заголовок и статистика */}
      <div className={styles.header}>
        <h1 className={styles.choice}>Выбор вопроса</h1>
        <select
          className={styles.chapterSelect}
          value={selectedChapter || ""}
          onChange={(e) => setSelectedChapter(e.target.value || null)}
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
      </div>

      {/* Кнопка вращения */}
      <button
        className={styles.spinButton}
        onClick={spinWheel}
        disabled={isSpinning || availableQuestions.length === 0}
      >
        {isSpinning ? "Вращается..." : "Крутить колесо"}
      </button>
    </div>
  );
}

export default QuestionSettings;
