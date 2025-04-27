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
  const [timerSeconds, setTimerSeconds] = useState("");
  const [question, setQuestion] = useState("");
  const [chapter, setChapter] = useState("");
  const [newSeconds, setNewSeconds] = useState(null);
  const [timer, setTimer] = useState(null);
  const [showWheel, setShowWheel] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const playerName = useRegistrationStore((state) => state.username);

  const { data: user } = useQuery(["user"], fetchUser);

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

  useEffect(() => {
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

        if (!hasSetName && playerName) {
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

          if (data.type === "question") {
            const currentQuestion = localStorage.getItem("question");

            if (data.content !== currentQuestion) {
              setPendingQuestion(data);
              setShowWheel(true);
              localStorage.setItem("pendingQuestion", JSON.stringify(data));
              localStorage.setItem("showWheel", "true");
            } else {
              setChapter(data.section || "");
              setQuestion(data.content || "");
              setTimer(data.timer);
            }

            if (data.timer_seconds !== undefined) {
              setTimerSeconds(data.timer_seconds);
            }
          }
        } catch (error) {
          console.error("Ошибка обработки сообщения:", error);
          toast.error("Ошибка обработки данных");
        }
      };
    };

    const initialTimer = setTimeout(connect, 1000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.close();
      }
      setIsComponentMounted(false);
    };
  }, [playerName, isComponentMounted]);

  useEffect(() => {
    if (seconds !== null) {
      localStorage.setItem("answerTimerSeconds", seconds.toString());
    }
  }, [seconds]);

  async function sendAnswerData(e) {
    e.preventDefault();
    if (!answer.trim()) {
      toast.warning("Введите ответ");
      return;
    }

    if (timer) {
      setLoading(true);
    }

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
      toast.error("Ошибка при отправке ответа");
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
    // логика при истечении времени
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
        isVisible={showWheel}
        onAnimationComplete={() => {
          if (pendingQuestion) {
            setChapter(pendingQuestion.section || "");
            setQuestion(pendingQuestion.content || "");
            setTimer(pendingQuestion.timer);

            if (pendingQuestion.timer_seconds) {
              setTimerSeconds(pendingQuestion.timer_seconds);
              setSeconds(pendingQuestion.timer_seconds);
              setNewSeconds(pendingQuestion.timer_seconds);
            }

            localStorage.setItem("chapter", pendingQuestion.section || "");
            localStorage.setItem("question", pendingQuestion.content || "");
            localStorage.setItem(
              "timer",
              pendingQuestion.timer ? "true" : "false"
            );

            setPendingQuestion(null);
            setShowWheel(false);
            localStorage.removeItem("pendingQuestion");
            localStorage.setItem("showWheel", "false");
          }
        }}
        animationSpeed={4}
      />
      {!showWheel && (
        <>
          <div className={styles.header}>
            <h1 className={styles.chapter}>{chapter || "Ожидайте раздел"}</h1>
            <div className={styles.timer}>
              {timer && (
                <AnswerTimer
                  time={extractTime}
                  duration={timerSeconds}
                  onTimeUp={handleTimeUp}
                  question={question}
                />
              )}
            </div>
            <p className={styles.question}>
              {question || "Ждите начала игры..."}
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
