import styles from "./Login.module.scss";
import { useState } from "react";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { Link } from "react-router";

function Login() {
  document.title = "Викторина | Вход";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Отправка данных из формы в БД
  function sendRegistrationData(e) {
    e.preventDefault();
  }

  return (
    <div className={styles.window}>
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
            Нет аккаунта?{" "}
            <Link to="/">
              <a>Зарегистрироваться</a>
            </Link>
          </p>
        </div>
        <Button onClick={sendRegistrationData}>Войти</Button>
      </form>
    </div>
  );
}
export default Login;
