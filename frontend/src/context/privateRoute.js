import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authContext";

function PrivateRoute({ children, requireAdmin = false }) {
    const { token, isAdmin, isReady } = useContext(AuthContext);

    if (!isReady) return null;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PrivateRoute;