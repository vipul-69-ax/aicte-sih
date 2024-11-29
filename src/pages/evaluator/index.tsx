import { Route, Routes } from "react-router-dom";
import EvaluatorAuth from "./auth";

export default function Evaluator(){
    return <Routes>
        <Route
           path="/" element={<EvaluatorAuth/>}
        />
    </Routes>
}