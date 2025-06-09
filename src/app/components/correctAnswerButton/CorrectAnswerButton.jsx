import styles from "./CorrectAnswerButton.module.scss";
import { instance } from "../../../api/instance";
import { toast } from "react-toastify";
import { useState } from "react";

function CorrectAnswerButton({ username, disabled }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    const points = isSelected ? -1 : 1;
    const success = await updatePoints(username, points);

    if (success) {
      await notifyAdminAboutPlayer(username, isSelected);
      setIsSelected(!isSelected);
    }

    setIsLoading(false);
  };

  return (
    <button
      className={`${styles.btn} ${isSelected ? styles.selected : ""}`}
      onClick={handleClick}
      disabled={isLoading || disabled}
    >
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
const updatePoints = async (username, points) => {
  try {
    await instance.post(
      `/users/score/add?username=${encodeURIComponent(
        username
      )}&points=${encodeURIComponent(points)}`
    );
    toast.success(points > 0 ? "Балл добавлен!" : "Балл удален!");
    return true;
  } catch (error) {
    const errorMessage =
      error.response?.data?.detail || "Ошибка при отправке данных";
    toast.error(errorMessage);
    return false;
  }
};

const notifyAdminAboutPlayer = async (username, isRemoving) => {
  try {
    const endpoint = isRemoving
      ? `/websocket/admin/remove_correct_player/{player_name}?username=${encodeURIComponent(
          username
        )}`
      : `/websocket/admin/add_correct_player/{player_name}?username=${encodeURIComponent(
          username
        )}`;

    await instance.post(endpoint);
  } catch (error) {
    const errorMessage =
      error.response?.data?.detail || "Ошибка при уведомлении администратора";
    toast.error(errorMessage);
    throw error;
  }
};

export default CorrectAnswerButton;
