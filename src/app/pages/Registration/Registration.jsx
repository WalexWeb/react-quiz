import styles from "./Registration.module.scss";
import { useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import { Link } from "react-router";

function Registration() {
document.title = "Викторина | Регистрация"

   const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  // Отправка данных из формы в БД
  function sendRegistrationData(e) {
    e.preventDefault();


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
        <Input type="password" id="passwordRepeat" />
        <div className={styles.enter}>
          <p>
            Уже есть аккаунт? <Link to='/login'><a>Войти</a></Link> 
          </p>
        </div>
        <Button onClick={sendRegistrationData}>Зарегистрироваться</Button>
      </form>
    </div>
  );
}

export default Registration;