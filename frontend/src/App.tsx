import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page/Home";
import UserFormPage from "./page/UserinfoForm";
import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/userinfo" element={<UserFormPage />} />
            </Routes>
        </Router>
    );
}

export default App;
