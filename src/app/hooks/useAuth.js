import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { instance } from "../../api/instance";
import useRegistrationStore from "../store/useRegistrationStore";

const useAuth = () => {
  const navigate = useNavigate();
  const { isLoading, username, password, setIsLoading } =
    useRegistrationStore();
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const validateForm = () => {
    if (!loginUsername.trim()) {
      toast.error("Введите название команды");
      return false;
    }
    if (!loginPassword) {
      toast.error("Введите пароль");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    if (username === loginUsername && password === loginPassword) {
      try {
        const response = await instance.post(
          `/users/login?username=${encodeURIComponent(
            loginUsername
          )}&password=${encodeURIComponent(loginPassword)}`
        );

        const { access_token, refresh_token } = response.data;
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        localStorage.setItem("registrationComplete", "true");

        toast.success("Вход успешен! Перенаправляем на колесо вопросов...");

        setTimeout(() => {
          localStorage.removeItem("registrationComplete");
          navigate("/question");
        }, 2000);
      } catch (error) {
        const errorMessage = error.response?.data?.detail || "Ошибка при входе";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else if (username !== loginUsername) {
      toast.error("Пользователь не существует");
      setIsLoading(false);
    } else if (password !== loginPassword) {
      toast.error("Неверный пароль");
      setIsLoading(false);
    }
  };

  return {
    loginUsername,
    setLoginUsername,
    loginPassword,
    setLoginPassword,
    handleLogin,
    isLoading,
  };
};

export default useAuth;
