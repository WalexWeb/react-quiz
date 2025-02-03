import "./index.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LazyMotion, domAnimation } from "framer-motion";
import { createBrowserRouter, RouterProvider } from "react-router";
import Registration from "./app/pages/Registration/Registration";
import Login from "./app/pages/Login/Login";
import Question from "./app/pages/Question/Question";
import Projector from "./app/pages/Projector/Projector";
import Admin from "./app/pages/Admin/Admin";
import Rating from "./app/pages/Rating/Rating";
import Jury from "./app/pages/Jury/Jury";

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
    element: <Admin/>,
  },
  {
    path: "/rating",
    element: <Rating/>,
  },
  {
    path: "/jury",
    element: <Jury/>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LazyMotion features={domAnimation}>
      <RouterProvider router={router} />
    </LazyMotion>
  </StrictMode>
);
