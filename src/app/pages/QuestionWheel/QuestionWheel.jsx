import { motion, AnimatePresence } from "framer-motion";
import styles from "./QuestionWheel.module.scss";
import { useEffect, useRef, useState } from "react";
import { instance } from "../../../api/instance";

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
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await instance.get("/question");
        const fetchedQuestions = res.data.map((item) => item.question);
        setQuestions(fetchedQuestions);
      } catch (err) {
        console.error("Ошибка загрузки вопросов:", err);
      }
    };

    fetchQuestions();
  }, []);

  const extendedQuestions = [...questions, ...questions, ...questions];

  useEffect(() => {
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
