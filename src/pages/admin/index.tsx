import { Route, Routes } from "react-router-dom";
import AdminPortal from "./dashboard";

export default function Institute(){
    return <Routes>
        <Route
           path="/" element={<AdminPortal/>}
        />
    </Routes>
}