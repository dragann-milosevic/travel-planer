import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LoginPage from "./pages/Login/LoginPage";
import RegistrationPage from "./pages/Registration/RegistrationPage";
import HomePage from "./pages/Home/HomePage";
import TravelPlanDetailsPage from "./pages/TravelPlanDetails/TravelPlanDetailsPage";
import SharedPlanPage from "./pages/SharedPlan/SharedPlanPage";
import AdminPage from "./pages/Admin/AdminPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import PrivateRoute from "./context/privateRoute";
import "./App.css";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registration" element={<RegistrationPage />} />
                <Route path="/shared/:token" element={<SharedPlanPage />} />

                <Route path="/" element={
                    <PrivateRoute><HomePage /></PrivateRoute>
                } />
                <Route path="/plans/:id" element={
                    <PrivateRoute><TravelPlanDetailsPage /></PrivateRoute>
                } />
                <Route path="/admin" element={
                    <PrivateRoute requireAdmin><AdminPage /></PrivateRoute>
                } />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default App;