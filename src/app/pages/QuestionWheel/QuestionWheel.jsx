import styles from "./QuestionWheel.module.scss";
import { useEffect, useState, useRef } from "react";
import { m, useAnimationControls } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { instance } from "../../../api/instance";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuestionSettings from "../../components/questionSettings/QuestionSettings";

const fetchQuestions = async (chapter) => {
  try {
    // Если выбран раздел, получаем вопросы из него
    // Убеждаемся, что chapter передается как строка
    const chapterStr = chapter ? String(chapter) : "";
    const endpoint = chapterStr ? `/question/${chapterStr}` : "/question";
    const { data } = await instance.get(endpoint);

    // Преобразуем данные в нужный формат
    const questions = Array.isArray(data) ? data : [];
    const formattedQuestions = questions.map((q) => ({
      id: q.id,
      question: q.question,
      answer: q.answer,
      chapter: `Раздел ${q.chapter}`,
    }));

    if (formattedQuestions.length === 0) {
      throw new Error("Нет доступных вопросов");
    }
    return formattedQuestions;
  } catch (error) {
    console.error("Ошибка при получении вопросов:", error);
    throw error;
  }
};

const QuestionWheel = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Константы
  const visibleQuestions = 3; // Сколько вопросов видно в окне
  const repetitions = 3; // Количество повторений

  // Refs и контроллеры
  const wheelRef = useRef(null);
  const controls = useAnimationControls();

  // Состояния
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [spinCount, setSpinCount] = useState(0);
  const [displayQuestions, setDisplayQuestions] = useState([]);

  // Данные
  const {
    data: questions = [],
    isLoading,
    isError,
  } = useQuery(
    ["questions", selectedChapter],
    () => fetchQuestions(selectedChapter),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
  const [availableQuestions, setAvailableQuestions] = useState([]);

  // Инициализация вопросов
  useEffect(() => {
    // Обновляем доступные вопросы при каждом изменении списка вопросов
    setAvailableQuestions(questions);
    // Сбрасываем счетчик при смене главы
    setSpinCount(0);
  }, [questions]);

  // Обновляем displayQuestions при изменении availableQuestions
  useEffect(() => {
    const newDisplayQuestions = [];
    for (let i = 0; i < repetitions; i++) {
      availableQuestions.forEach((question, baseIndex) => {
        newDisplayQuestions.push({
          ...question,
          displayIndex: baseIndex,
          repetitionIndex: i,
        });
      });
    }
    setDisplayQuestions(newDisplayQuestions);
  }, [availableQuestions, repetitions]);

  // Функция вращения колеса
  const spinWheel = async () => {
    if (isSpinning || availableQuestions.length === 0) return;

    try {
      // Set spinning state immediately
      setIsSpinning(true);

      // Определяем размеры в зависимости от устройства
      const isMobile = window.innerWidth <= 768;
      const itemHeight = isMobile ? 80 : 120;

      // Очистка полей перед выбором вопроса
      setSelectedQuestion(null);
      setSelectedIndex(null);

      // Выбираем случайный вопрос
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const question = availableQuestions[randomIndex];

      // Рассчитываем позиции для анимации
      const spins = 2;
      const spinDistance = availableQuestions.length * itemHeight * spins;
      const centerOffset = Math.floor(visibleQuestions / 2);
      const finalPosition = (centerOffset + randomIndex) * itemHeight;

      // Запускаем анимацию
      await controls.start({
        y: [0, -spinDistance, -finalPosition],
        transition: {
          duration: 4,
          times: [0, 0.7, 1],
          ease: ["easeIn", "easeOut", "circOut"],
        },
      });

      // Set the selected question immediately after animation
      setSelectedQuestion(question);
      setSelectedIndex(randomIndex);
      setSpinCount((prev) => prev + 1);

      // Remove the selected question from available questions

      // Остановка вращения и переход на страницу вопроса
      setTimeout(() => {
        setAvailableQuestions((prev) =>
          prev.filter((q) => q.id !== question.id)
        );
        setIsSpinning(false);
      }, 1000);
    } catch (error) {
      console.error("Ошибка при вращении колеса:", error);
      setIsSpinning(false);
    }
  };

  // Обработка состояния загрузки и ошибок
  if (isError) {
    return (
      <div className={styles.wheelContainer}>
        <div className={styles.header}>
          <h1>Ошибка</h1>
          <p>Не удалось загрузить вопросы. Пожалуйста, попробуйте позже.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wheelContainer}>
      {/* Заголовок и статистика */}
      <h1 className={styles.choice}>Выбор вопроса</h1>

      {/* Окно колеса */}
      <div className={styles.wheelWindow}>
        {/* Фоновые элементы */}
        <div className={styles.wheelBackground}>
          <div className={styles.gradientTop} />
          <div className={styles.gradientBottom} />
        </div>

        {/* Колесо с вопросами */}
        <m.div
          ref={wheelRef}
          className={styles.wheel}
          animate={controls}
          initial={{ y: 0 }}
        >
          {displayQuestions.map((question, index) => {
            const isSelected =
              selectedQuestion &&
              question.id === selectedQuestion.id &&
              question.displayIndex === selectedIndex &&
              question.repetitionIndex === 1;

            return (
              <m.div
                key={`${question.id}-${index}`}
                className={`${styles.questionItem} ${
                  isSelected ? styles.selected : ""
                }`}
                initial={{ scale: 1 }}
                animate={{ scale: isSelected ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {question.question}
              </m.div>
            );
          })}
        </m.div>
        {/* Указатель */}
        <div className={styles.pointer} />
      </div>
    </div>
  );
};

export default QuestionWheel;
