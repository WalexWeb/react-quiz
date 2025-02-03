import "./index.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LazyMotion, domAnimation } from "framer-motion";
import { createBrowserRouter, RouterProvider } from "react-router";
import Registration from "./app/pages/Registration/Registration";
import Login from "./app/pages/Login/Login.jsx";
import Question from "./app/pages/Question/Question";
import Projector from "./app/pages/Projector/Projector";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Registration />,
    errorElement: <div>Error 404</div>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/question",
    element: <Question />,
  },
  {
    path: "/projector",
    element: <Projector />,
  },
  {
    path: "/admin-panel",
    element: "",
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LazyMotion features={domAnimation}>
      <RouterProvider router={router} />
    </LazyMotion>
  </StrictMode>
);
