import styles from "./AnswersTable.module.scss";
import { useRef } from "react";
import { useQuery } from "react-query";
import { instance } from "../../../api/instance";
import CorrectAnswerButton from "../correctAnswerButton/CorrectAnswerButton";
import { ToastContainer } from "react-toastify";
import {
  animate,
  m,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

const transparent = `#0000`;
const opaque = `#000`;

function useScrollOverflowMask(scrollXProgress) {
  const maskImage = useMotionValue(
    `linear-gradient(90deg, ${transparent}, ${opaque} 20%, ${opaque} 80%, ${transparent})`
  );
  useMotionValueEvent(scrollXProgress, "change", (value) => {
    if (value === 0) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${opaque}, ${opaque} 20%, ${opaque} 80%, ${transparent})`
      );
    } else if (value === 1) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} 20%, ${opaque} 80%, ${opaque})`
      );
    } else if (
      scrollXProgress.getPrevious() === 0 ||
      scrollXProgress.getPrevious() === 1
    ) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} 20%, ${opaque} 80%, ${transparent})`
      );
    }
  });
  return maskImage;
}

function AnswersTable({ question }) {
  const ref = useRef(null);
  const { scrollXProgress } = useScroll({ container: ref });
  const maskImage = useScrollOverflowMask(scrollXProgress);

  // Получение всех ответов пользователей и времени ответа
  const fetchAnswers = async () => {
    try {
      const data = await instance.get(
        `/answers/question/${encodeURIComponent(question)}`
      );
      return data.data;
    } catch (error) {
      console.log(error.message);
    }
  };

  const { data: answers, isLoading } = useQuery(
    ["answers", question],
    fetchAnswers,
    {
      refetchInterval: 5000, // Обновляем ответы каждые 5 секунд
      retry: 8, // Повторные попытки при ошибках (8 раз)
    }
  );

  if (isLoading) {
    return <h1>Загрузка...</h1>;
  }
  // Форматируем
  const formattedAnswers = answers
    .map((a) => ({
      answer_at: a.answer_at,
      question: a.question,
      username: a.username,
      answer: a.answer,
      id: a.id,
    }))
    .sort((a, b) => a.answer_at - b.answer_at); // Сортировка ответов по времени

  function handleClick(e) {
    e.preventDefault();
  }

  return (
    <div className={styles.example}>
      <m.ul ref={ref} style={{ maskImage }}>
        {formattedAnswers.map((answer, index) => (
          <li key={index}>
            <div className={styles.username}>{answer.username}</div>
            <div className={styles.team_answer}>{answer.answer}</div>
            <div className={styles.time}>{answer.answer_at}</div>
            <div className={styles.currentAnswer}>
              <CorrectAnswerButton
                onClick={handleClick}
                username={answer.username}
                disabled={answer.answer === "Нет ответа"}
              />
            </div>
          </li>
        ))}
      </m.ul>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
export default AnswersTable;
