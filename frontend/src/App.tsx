import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page/Home";
import UserFormPage from "./page/UserinfoForm";
import "./App.css";
import UserConditionsForm from "./page/UserConditionsForm.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/userinfo" element={<UserFormPage />} />
                <Route path="/userConditions" element={<UserConditionsForm />}/>
            </Routes>
        </Router>
    );
}

export default App;
