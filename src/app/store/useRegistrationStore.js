import { create } from "zustand";

const useRegistrationStore = create((set) => ({
  username: "",
  password: "",
  passwordRepeat: "",
  isLoading: false,
  setUsername: (username) => set({ username }),
  setPassword: (password) => set({ password }),
  setPasswordRepeat: (passwordRepeat) => set({ passwordRepeat }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useRegistrationStore;
