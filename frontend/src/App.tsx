import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page/Home";
import UserFormPage from "./page/UserinfoForm";
import UserConditionsForm from "./page/UserConditionsForm";
import Result from "./page/Result";
import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/userinfo" element={<UserFormPage />} />
                <Route path="/userConditions" element={<UserConditionsForm />} />
                <Route path="/result" element={<Result />} /> {/* <-- neue Route */}
            </Routes>
        </Router>
    );
}

export default App;
