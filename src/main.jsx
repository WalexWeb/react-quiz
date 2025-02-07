import "./index.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LazyMotion, domAnimation } from "framer-motion";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./app/App";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LazyMotion features={domAnimation}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <App />
        </BrowserRouter>
      </QueryClientProvider>
    </LazyMotion>
  </StrictMode>
);
