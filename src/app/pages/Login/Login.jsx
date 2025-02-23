import styles from "./Login.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { instance } from "../../../api/instance";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Валидация формы
  const validateForm = () => {
    if (!username.trim()) {
      toast.error("Введите название команды");
      return false;
    }
    if (!password) {
      toast.error("Введите пароль");
      return false;
    }
    return true;
  };

  // Отправка данных для входа
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await instance.post(
        `/users/login?username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`
      );

      // Сохраняем токены в localStorage
      const { access_token, refresh_token } = response.data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      toast.success("Вход успешен! Перенаправляем на колесо вопросов...");

      setTimeout(() => {
        navigate("/question");
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Ошибка при входе";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.window}>
      <title>Викторина | Вход</title>
      <form className={styles.form}>
        <h1 className={styles.header}>Вход</h1>
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
        <div className={styles.enter}>
          <p>
            Нет аккаунта? <Link to="/">Зарегистрироваться</Link>
          </p>
        </div>
        <Button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Вход..." : "Войти"}
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
export default Login;
