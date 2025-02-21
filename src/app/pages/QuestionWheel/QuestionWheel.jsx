import { motion, AnimatePresence } from "framer-motion";
import styles from "./QuestionWheel.module.scss";
import { useEffect, useRef, useState } from "react";

const questions = [
  "Подвигу защитникам какой крепости посвящена картина «Бессмертие»?",
  "Назовите имя поэтессы блокадного Ленинграда, автора «Никто не забыт...»",
  "Как называлась первая советская кинокартина, получившая «Оскар»?",
  "В каком прифронтовом городе написана песня «Прощай, любимый город»?",
  "Как назывался коллектив художников, создавший плакат о внуках Суворова?",
  "Какое оружие получило прозвище «папаша»?",
  "Как бойцы называли 45-мм противотанковую пушку?",
  "Какое противотанковое изобретение представляло собой шестиконечную фигуру?",
  "Какой самолет называли «летающим танком»?",
  "Какой танк изображен на советской медали «За отвагу»?",
  "Как называется поэма Твардовского о переправе?",
  "Как называется песня 1943 года из фильма «Два бойца»?",
  "Какому событию посвящена карикатура «Потеряла я колечко»?",
  "Обороне какого города посвящена картина Дейнеки 1942 года?",
  "Как называется картина Сергея Герасимова 1943 года?",
  "Какой грузовик называли «Захар Иванович»?",
  "Какой истребитель впервые участвовал в боях при Сталинграде?",
  "Какая САУ удивила немцев на Курской дуге?",
  "Как называлось оружие на базе ППШ из блокадного Ленинграда?",
  "Что означает ИС в названии советского тяжёлого танка?",
];

const truncateText = (text, maxWords = 8) => {
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
};

const QuestionWheel = ({
  isVisible,
  onAnimationComplete,
  animationSpeed = 4,
}) => {
  const audioRef = useRef(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);

  useEffect(() => {
    // Создаем аудио элемент при монтировании компонента
    audioRef.current = new Audio("/wheel.mp3");
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const enableAudio = async () => {
    try {
      // Пробуем воспроизвести и сразу поставить на паузу
      await audioRef.current.play();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioEnabled(true);
      setShowAudioPrompt(false);
    } catch (error) {
      console.error("Error enabling audio:", error);
    }
  };

  useEffect(() => {
    if (isVisible && audioRef.current && audioEnabled) {
      console.log("Attempting to play sound...");
      try {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Sound playing successfully");
            })
            .catch((error) => {
              console.error("Error playing sound:", error);
              // Если воспроизведение не удалось, показываем промпт снова
              setShowAudioPrompt(true);
              setAudioEnabled(false);
            });
        }
      } catch (error) {
        console.error("Error in audio play:", error);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isVisible, audioEnabled]);

  // Создаем расширенный список вопросов, добавляя вопросы в начало и конец
  const extendedQuestions = [...questions, ...questions, ...questions];

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    },
  };

  const wheelVariants = {
    initial: {
      y: "0%",
    },
    animate: {
      y: "-66.666%",
      transition: {
        duration: animationSpeed,
        ease: "linear",
        onComplete: () => {
          onAnimationComplete?.();
        },
      },
    },
  };

  return (
    <>
      <AnimatePresence>
        {showAudioPrompt && (
          <motion.div
            className={styles.audioPrompt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button onClick={enableAudio} className={styles.audioButton}>
              Включить звук
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={styles.modal}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={styles.wheelContainer}>
              <motion.div
                className={styles.wheel}
                variants={wheelVariants}
                initial="initial"
                animate="animate"
              >
                {extendedQuestions.map((question, index) => (
                  <div
                    key={`question-${index}`}
                    className={styles.questionItem}
                  >
                    {truncateText(question)}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuestionWheel;
