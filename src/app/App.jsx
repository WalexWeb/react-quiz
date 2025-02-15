import { Route, Routes } from "react-router-dom";
import Registration from "../app/pages/Registration/Registration";
import Login from "../app/pages/Login/Login";
import Question from "../app/pages/Question/Question";
import Projector from "../app/pages/Projector/Projector";
import Admin from "../app/pages/Admin/Admin";
import Rating from "../app/pages/Rating/Rating";
import Jury from "../app/pages/Jury/Jury";
import Answers from '../app/pages/Answers/Answers'
import QuestionWheel from "../app/pages/QuestionWheel/QuestionWheel";
import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");

  const handleQuestion = (question) => {
    setQuestion(question);
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/question" element={<Question />} />
        <Route path="/projector" element={<Projector question={question} />} />
        <Route path="/admin-panel" element={<Admin />} />
        <Route path="/rating" element={<Rating />} />
        <Route path="/answers" element={<Answers />}/>
        <Route path="/jury" element={<Jury />} />
        <Route path="/question-wheel" element={<QuestionWheel onChange={handleQuestion} />} />
      </Routes>
    </div>
  );
}

export default App;
