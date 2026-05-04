import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

function Navbar() {
    const { token, userName, isAdmin, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <i className="bi bi-airplane me-2"></i>Travel Planer
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navMenu"
                    aria-controls="navMenu"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navMenu">
                    <ul className="navbar-nav me-auto">
                        {token && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/">
                                    <i className="bi bi-list-ul me-1"></i>Moji planovi
                                </NavLink>
                            </li>
                        )}
                        {token && isAdmin && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/admin">
                                    <i className="bi bi-people me-1"></i>Admin
                                </NavLink>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        {token ? (
                            <>
                                <li className="nav-item">
                                    <span className="navbar-text me-3">
                                        <i className="bi bi-person-circle me-1"></i>
                                        {userName || "korisnik"}
                                        {isAdmin && (
                                            <span className="badge bg-warning text-dark ms-2">Admin</span>
                                        )}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-light btn-sm"
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right me-1"></i>Odjava
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login">Prijava</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/registration">Registracija</NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;