import styles from "./CorrectAnswerButton.module.scss";
import { instance } from "../../../api/instance";
import { toast } from "react-toastify";
import { useState } from "react";

function CorrectAnswerButton({ userId }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    addPoints(userId);
    setIsLoading(true);
  };

  return (
    <button className={styles.btn} onClick={handleClick} disabled={isLoading}>
      <svg
        width="37"
        height="30"
        viewBox="0 0 49 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.58043 21.8809L19.0055 37.3059"
          stroke="white"
          stroke-width="7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M19.4436 37.8907L44.4636 3.61764"
          stroke="white"
          stroke-width="7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  );
}

// Добавление баллов конкретному пользователю
const addPoints = async (user_id) => {
  try {
    await instance.post(
      `/users/score/add?user_id=${encodeURIComponent(
        user_id
      )}&points=${encodeURIComponent(1)}`
    );
    toast.success("Балл присвоен!");
  } catch (error) {
    const errorMessage =
      error.response?.data?.detail || "Ошибка при отправке данных";
    toast.error(errorMessage);
  }
};

export default CorrectAnswerButton;
