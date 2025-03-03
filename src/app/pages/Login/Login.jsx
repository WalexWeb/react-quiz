import styles from "./Login.module.scss";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";

function Login() {
  const {
    loginUsername,
    setLoginUsername,
    loginPassword,
    setLoginPassword,
    handleLogin,
    isLoading,
  } = useAuth(); // Используем хук

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
        <Button onClick={handleLogin}>Войти</Button>
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
