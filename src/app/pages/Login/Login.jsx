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
import useLogin from "../../hooks/useLogin";

function Login() {
  const navigate = useNavigate();

  const {
    loginUsername,
    setLoginUsername,
    loginPassword,
    setLoginPassword,
    handleLogin,
  } = useLogin(navigate); // Используем кастомный хук

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
