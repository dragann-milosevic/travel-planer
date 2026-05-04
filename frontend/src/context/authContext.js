import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isReady, setIsReady] = useState(false);

    function safeDecode(t) {
        try { return jwtDecode(t); }
        catch (e) { return null; }
    }

    function getId(decoded) {
        if (!decoded) return null;
        return decoded["nameid"]
            || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
            || decoded["sub"]
            || null;
    }

    function getUserName(decoded) {
        if (!decoded) return null;
        return decoded["unique_name"]
            || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
            || decoded["name"]
            || null;
    }

    function getIsAdmin(decoded) {
        if (!decoded) return false;
        const role = decoded["role"]
            || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        return role === "Admin";
    }

    function isExpired(decoded) {
        if (!decoded || !decoded.exp) return true;
        return decoded.exp * 1000 < Date.now();
    }

    const login = useCallback((newToken) => {
        const decoded = safeDecode(newToken);
        if (!decoded || isExpired(decoded)) {
            sessionStorage.removeItem("token");
            setToken(null);
            setUserId(null);
            setUserName(null);
            setIsAdmin(false);
            return false;
        }
        sessionStorage.setItem("token", newToken);
        setToken(newToken);
        setUserId(getId(decoded));
        setUserName(getUserName(decoded));
        setIsAdmin(getIsAdmin(decoded));
        return true;
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem("token");
        setToken(null);
        setUserId(null);
        setUserName(null);
        setIsAdmin(false);
    }, []);

    useEffect(() => {
        const storedToken = sessionStorage.getItem("token");
        if (storedToken) {
            login(storedToken);
        }
        setIsReady(true);
    }, [login]);

    return (
        <AuthContext.Provider value={{
            token, userId, userName, isAdmin, isReady, login, logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;