import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import UserFormPage from "./page/UserinfoPage";
import UserConditionsPage from "./page/UserConditionsPage";
import ResultPage from "./page/ResultPage";
import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/userinfo" element={<UserFormPage />} />
                <Route path="/userConditions" element={<UserConditionsPage />} />
                <Route path="/result" element={<ResultPage />} />
            </Routes>
        </Router>
    );
}

export default App;
