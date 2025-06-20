import styles from "./Question.module.scss";
import { useState, useEffect } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import AnswerTimer from "../../components/answerTimer/AnswerTimer";
import QuestionWheel from "../QuestionWheel/QuestionWheel";
import { ToastContainer, toast } from "react-toastify";
import { instance } from "../../../api/instance";
import { useQuery } from "react-query";
import useRegistrationStore from "../../store/useRegistrationStore";
import { getWebSocketUrl } from "../../../api/websocketConfig";

const fetchUser = async () => {
  try {
    const data = await instance.get("/users/me");
    return data.data;
  } catch (error) {
    console.log(error.message);
  }
};

function Question() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(null);
  const [question, setQuestion] = useState("");
  const [chapter, setChapter] = useState("");
  const [newSeconds, setNewSeconds] = useState(null);
  const [timer, setTimer] = useState(null);
  const [showWheel, setShowWheel] = useState(() =>
    JSON.parse(localStorage.getItem("showWheel") || "false")
  );
  const [pendingQuestion, setPendingQuestion] = useState(() =>
    JSON.parse(localStorage.getItem("pendingQuestion") || "null")
  );
  const [wsConnected, setWsConnected] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const [answerSubmitted, setAnswerSubmitted] = useState(() =>
    JSON.parse(localStorage.getItem("answerSubmitted") || "false")
  );
  const playerName = useRegistrationStore((state) => state.username);

  const { data: user } = useQuery(["user"], fetchUser);

  useEffect(() => {
    const savedTimer = localStorage.getItem("timer");
    const savedAnswerSubmitted = localStorage.getItem("answerSubmitted");
    const savedSeconds = localStorage.getItem("answerTimerSeconds");
    const savedQuestion = localStorage.getItem("question");

    if (savedTimer) {
      setTimer(savedTimer === "true");
    }
    if (savedAnswerSubmitted) {
      setAnswerSubmitted(savedAnswerSubmitted === "true");
    }
    if (savedSeconds && savedQuestion) {
      setSeconds(parseInt(savedSeconds));
      setNewSeconds(parseInt(savedSeconds));
    }
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem("showWheel");
      localStorage.removeItem("pendingQuestion");
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("registrationComplete") === "true") {
      return;
    }

    let ws = null;
    let reconnectTimer;
    let isReconnecting = false;
    let hasSetName = false;

    const connect = () => {
      if (isReconnecting || ws?.readyState === WebSocket.CONNECTING) return;
      isReconnecting = true;

      if (ws?.readyState === WebSocket.OPEN) {
        hasSetName = false;
        ws.close();
      }

      ws = new WebSocket(getWebSocketUrl("/ws/player"));

      ws.onopen = () => {
        setWsConnected(true);
        isReconnecting = false;

        if (!hasSetName) {
          if (playerName) {
            setTimeout(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(
                  JSON.stringify({
                    type: "set_name",
                    name: playerName,
                    reconnect: true,
                  })
                );
                hasSetName = true;
                toast.success("Подключение установлено!");
              }
            }, 500);
          } else {
            console.error("Имя игрока не найдено в localStorage");
            toast.error("Имя игрока не найдено");
          }
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        if (isComponentMounted && !isReconnecting) {
          hasSetName = false;
          toast.warning("Соединение потеряно. Переподключение...");
          reconnectTimer = setTimeout(connect, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast.error("Ошибка подключения");
      };

      ws.onmessage = (event) => {
        try {
          if (event.data === "clear_storage") {
            localStorage.clear();
            window.location.reload();
            return;
          }

          const data = JSON.parse(event.data);

          const timerDuration = 40;

          if (isComponentMounted) {
            const isNewQuestion =
              data.content !== localStorage.getItem("question");

            if (isNewQuestion) {
              localStorage.removeItem("showWheel");
              localStorage.removeItem("pendingQuestion");
              localStorage.setItem("answerSubmitted", "false");
              localStorage.setItem(
                "answerTimerSeconds",
                timerDuration.toString()
              );

              setShowWheel(false);
              setPendingQuestion(null);
              setAnswerSubmitted(false);
              setNewSeconds(timerDuration);
              setSeconds(timerDuration);
            } else {
              const savedSeconds = localStorage.getItem("answerTimerSeconds");
              if (savedSeconds) {
                setNewSeconds(parseInt(savedSeconds));
                setSeconds(parseInt(savedSeconds));
              }
            }

            setChapter(data.section || "");
            setQuestion(data.content || "");
            setTimer(data.timer);
            setLoading(false);

            localStorage.setItem("timer", data.timer ? "true" : "false");
            localStorage.setItem("loading", "false");
            localStorage.setItem("chapter", data.section || "");
            localStorage.setItem("question", data.content || "");

            if (data.timer === false && data.answer !== null) {
              setPendingQuestion(data);
              setShowWheel(true);
              localStorage.setItem("pendingQuestion", JSON.stringify(data));
              localStorage.setItem("showWheel", "true");
            }
          }
        } catch (error) {
          if (isComponentMounted) {
            toast.error("Ошибка обработки данных");
          }
        }
      };
    };

    const initialConnectionTimer = setTimeout(connect, 1000);

    return () => {
      clearTimeout(initialConnectionTimer);
      clearTimeout(reconnectTimer);
      isReconnecting = false;
      hasSetName = false;
      if (ws) {
        ws.close();
      }
      setIsComponentMounted(false);
    };
  }, []);

  useEffect(() => {
    if (seconds !== null) {
      localStorage.setItem("answerTimerSeconds", seconds.toString());
    }
  }, [seconds]);

  useEffect(() => {
    const savedTimer = localStorage.getItem("timer");
    const savedAnswerSubmitted = localStorage.getItem("answerSubmitted");
    const savedSeconds = localStorage.getItem("answerTimerSeconds");

    if (savedTimer) {
      setTimer(JSON.parse(savedTimer));
    }
    if (savedAnswerSubmitted) {
      setAnswerSubmitted(JSON.parse(savedAnswerSubmitted));
    }
    if (savedSeconds) {
      setSeconds(parseInt(savedSeconds));
      setNewSeconds(parseInt(savedSeconds));
    }
  }, []);

  async function sendAnswerData(e) {
    e.preventDefault();
    if (!answer.trim()) {
      toast.warning("Введите ответ");
      return;
    }

    if (timer) {
      setLoading(true);
    }
    localStorage.setItem("loading", "true");

    try {
      await instance.post(
        `/answers/?question=${encodeURIComponent(
          question
        )}&username=${encodeURIComponent(
          user?.username || ""
        )}&answer=${encodeURIComponent(answer)}`
      );
      toast.success("Ответ отправлен!");
      setAnswer("");
      setLoading(false);
      setAnswerSubmitted(true);
      localStorage.setItem("answerSubmitted", "true");
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.detail || "Ошибка при отправке ответа";
      toast.error(errorMessage);
    }
  }

  useEffect(() => {
    if (seconds === 0 && !answerSubmitted) {
      const sendNoAnswer = async () => {
        try {
          await instance.post(
            `/answers/?question=${encodeURIComponent(
              question
            )}&username=${encodeURIComponent(
              user?.username || ""
            )}&answer=${encodeURIComponent("Нет ответа")}`
          );
          toast.warning("Время истекло. Ответ отправлен автоматически.");
          setAnswerSubmitted(true);
          localStorage.setItem("answerSubmitted", "true");
        } catch (error) {
          toast.error("Ошибка при автоматической отправке ответа");
        }
      };

      sendNoAnswer();
    }
  }, [seconds, answerSubmitted, question, user]);

  const handleTimeUp = () => {
  };

  const extractTime = (second) => {
    setSeconds(second);
  };

  return (
    <div className={styles.window}>
      <title>Викторина</title>
      {!wsConnected && (
        <div className={styles.connectionStatus}>Подключение к серверу...</div>
      )}
      <QuestionWheel
        key="question-wheel"
        isVisible={showWheel}
        onAnimationComplete={() => {
          if (pendingQuestion) {
            const timerDuration = 40;
            setNewSeconds(timerDuration);
            setChapter(pendingQuestion.section || "");
            setQuestion(pendingQuestion.content || "");
            setTimer(pendingQuestion.timer);

            localStorage.setItem(
              "timer",
              pendingQuestion.timer ? "true" : "false"
            );
            localStorage.setItem(
              "answerTimerSeconds",
              timerDuration.toString()
            );
            localStorage.setItem("chapter", pendingQuestion.section || "");
            localStorage.setItem("question", pendingQuestion.content || "");
            setPendingQuestion(null);
            setShowWheel(false);
            localStorage.setItem("showWheel", "false");
            localStorage.removeItem("pendingQuestion");
          }
        }}
        animationSpeed={4}
      />
      {!showWheel && (
        <>
          <div className={styles.header}>
            <h1 className={styles.chapter}>
              {localStorage.getItem("chapter") || "Ожидайте раздел"}
            </h1>
            <div className={styles.timer}>
              {timer && (
                <AnswerTimer
                  time={extractTime}
                  duration={newSeconds}
                  onTimeUp={handleTimeUp}
                  question={question}
                />
              )}
            </div>
            <p className={styles.question}>
              {localStorage.getItem("question") || "Ждите начала игры..."}
            </p>
          </div>
          <form className={styles.form} onSubmit={sendAnswerData}>
            <Input
              value={answer}
              maxLength={50}
              onChange={(e) => setAnswer(e.target.value)}
              type="text"
              disabled={!wsConnected || !timer || answerSubmitted}
              placeholder={!wsConnected ? "Подключение..." : "Введите ответ"}
            />
            <Button
              type="submit"
              disabled={
                !wsConnected ||
                !timer ||
                seconds === 0 ||
                loading ||
                answerSubmitted
              }
            >
              {loading ? "Отправка..." : "Отправить ответ"}
            </Button>
          </form>
        </>
      )}
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

export default Question;