import styles from "./Registration.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { instance } from "../../../api/instance";

function Registration() {
  document.title = "Викторина | Регистрация";
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Валидация формы
  const validateForm = () => {
    if (!username.trim()) {
      toast.error("Введите название команды");
      return false;
    }
    if (password.length < 6) {
      toast.error("Пароль должен быть не менее 6 символов");
      return false;
    }
    if (password !== passwordRepeat) {
      toast.error("Пароли не совпадают");
      return false;
    }
    return true;
  };

  // Отправка данных из формы в БД
  async function sendRegistrationData(e) {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await instance.post(
        `/users/registration?username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`
      );
      toast.success(
        "Регистрация успешна! Перенаправляем на страницу вопроса..."
      );

      // Сохраняем токены в localStorage
      const { access_token, refresh_token } = response.data.user;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      // Сохраняем имя пользователя в localStorage
      localStorage.setItem("playerName", username);

      // Даем время увидеть уведомление (можешь менять)
      setTimeout(() => {
        navigate("/question");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Ошибка при регистрации";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.window}>
      <form className={styles.form}>
        <h1 className={styles.header}>Регистрация</h1>
        <label htmlFor="username">Введите название команды</label>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          id="username"
        />
        <label htmlFor="password">Введите пароль</label>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="password"
        />
        <label htmlFor="passwordRepeat">Повторите пароль</label>
        <Input
          value={passwordRepeat}
          onChange={(e) => setPasswordRepeat(e.target.value)}
          type="password"
          id="passwordRepeat"
        />
        <div className={styles.enter}>
          <p>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
        <Button onClick={sendRegistrationData} disabled={isLoading}>
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </form>
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

export default Registration;
