import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist((set) => ({
    
  })),
  {
    name: "",
    getStorage: () => localStorage,
  }
);
