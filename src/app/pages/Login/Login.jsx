import styles from "./Login.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { instance } from "../../../api/instance";
import useRegistrationStore from "../../store/useRegistrationStore";

function Login() {
  const navigate = useNavigate();

  const { isLoading, username, password } = useRegistrationStore();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

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

    if (username === loginUsername && password === loginPassword) {
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

        // Добавляем флаг, что регистрация завершена
        localStorage.setItem("registrationComplete", "true");

        toast.success("Вход успешен! Перенаправляем на колесо вопросов...");

        setTimeout(() => {
          localStorage.removeItem("registrationComplete"); // Очищаем флаг
          navigate("/question");
        }, 2000);
      } catch (error) {
        const errorMessage = error.response?.data?.detail || "Ошибка при входе";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.window}>
      <title>Викторина | Вход</title>
      <form className={styles.form}>
        <h1 className={styles.header}>Вход</h1>
        <label htmlFor="username">Введите название команды</label>
        <Input
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
          type="text"
          id="username"
        />
        <label htmlFor="password">Введите пароль</label>
        <Input
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
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
