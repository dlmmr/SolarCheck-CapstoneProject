import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import UserFormPage from "./page/UserinfoPage";
import UserConditionsPage from "./page/UserConditionsPage";
import ResultPage from "./page/ResultPage";
import "./App.css";
import Layout from "./assets/Layout.tsx";

function App() {
    return (
        <Router>
            <Layout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/userinfo" element={<UserFormPage />} />
                <Route path="/userConditions" element={<UserConditionsPage />} />
                <Route path="/result" element={<ResultPage />} />
                {/*<Route path="/info" element={<InfoPage />} />*/}
                {/* Footer Links - kannst du später implementieren */}
                <Route path="/impressum" element={<div>Impressum</div>} />
                <Route path="/datenschutz" element={<div>Datenschutz</div>} />
                <Route path="/agb" element={<div>AGB</div>} />
                <Route path="/kontakt" element={<div>Kontakt</div>} />
            </Routes>
            </Layout>
        </Router>
    );
}

export default App;
