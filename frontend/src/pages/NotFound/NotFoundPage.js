import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div className="container py-5 text-center">
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <p className="lead">Tražena stranica ne postoji.</p>
            <Link to="/" className="btn btn-primary">
                <i className="bi bi-house me-2"></i>Početna
            </Link>
        </div>
    );
}

export default NotFoundPage;