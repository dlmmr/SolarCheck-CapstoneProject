import { Link } from "react-router-dom";
import SolarBalkonCheckLogo from "../page/images/SolarBalkonCheckLogo.png";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="app-footer">
            <div className="footer-content">
                <img
                    src={SolarBalkonCheckLogo}
                    alt="BalkonSolarCheck Logo"
                    className="footer-logo"
                />
                <nav className="footer-links">
                    <Link to="/impressum" className="footer-link">Impressum</Link>
                    <Link to="/datenschutz" className="footer-link">Datenschutz</Link>
                    <a href="https://github.com" className="footer-link" target="_blank" rel="noopener noreferrer">GitHub</a>
                </nav>
                <span className="footer-copyright">© {currentYear}</span>
            </div>
        </footer>
    );
}
