import {Link, useLocation} from "react-router-dom";

export default function Header() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="app-header">
            <div className="header-content">
                <Link to="/" className="header-logo">
                    <span className="logo-text">BalkonSolarCheck</span>
                </Link>
                <nav className="header-nav">
                    <Link
                        to="/info"
                        className={`nav-button ${isActive('/info') ? 'nav-button--active' : ''}`}
                    >
                        Was ist ein Balkonkraftwerk?
                    </Link>
                </nav>
            </div>
        </header>
    );
}
