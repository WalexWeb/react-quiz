import { create } from "zustand";
import { persist } from "zustand/middleware";

const useRegistrationStore = create(
  persist((set) => ({
    username: "",
    password: "",
    passwordRepeat: "",
    isLoading: false,
    setUsername: (username) => set({ username }),
    setPassword: (password) => set({ password }),
    setIsLoading: (isLoading) => set({ isLoading }),
  })),
  {
    name: "reg-storage",
    getStorage: () => localStorage,
  }
);

export default useRegistrationStore;
