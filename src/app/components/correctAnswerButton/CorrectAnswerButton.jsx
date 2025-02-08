import "../../../icons/correct.svg";
import styles from "./CorrectAnswerButton.module.scss";
import { instance } from "../../../api/instance";
import { toast } from "react-toastify";

function CorrectAnswerButton({ userId }) {
  const handleClick = () => {
    addPoints(userId);
  };

  return (
    <button className={styles.btn} onClick={handleClick}>
      Добавить балл
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
