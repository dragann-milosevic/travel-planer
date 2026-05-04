import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/authService/authService";
import { AuthContext } from "../../context/authContext";
import LoginModel from "../../models/LoginModel";
import FormField from "../FormField/FormField";

function LoginForm() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [model, setModel] = useState(LoginModel.empty());
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setModel(prev => {
            const next = new LoginModel({ ...prev, [name]: value });
            return next;
        });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setServerError("");
        const validation = model.validate();
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }
        setSubmitting(true);
        const result = await authService.login(model);
        setSubmitting(false);

        if (!result.ok) {
            setServerError(result.error || "Pogrešno korisničko ime ili lozinka.");
            return;
        }

        const token = typeof result.data === "string"
            ? result.data
            : (result.data?.token || result.data);

        if (!token || !login(token)) {
            setServerError("Nevažeći token sa servera.");
            return;
        }
        navigate("/");
    }

    return (
        <div className="card shadow-sm">
            <div className="card-body p-4">
                <h2 className="text-center mb-4">Prijava</h2>
                {serverError && (
                    <div className="alert alert-danger" role="alert">{serverError}</div>
                )}
                <form onSubmit={handleSubmit} noValidate>
                    <FormField
                        label="Email ili korisničko ime"
                        name="emailOrUserName"
                        value={model.emailOrUserName}
                        onChange={handleChange}
                        error={errors.emailOrUserName}
                        placeholder="primer@gmail.com"
                        required
                    />
                    <FormField
                        label="Lozinka"
                        name="password"
                        type="password"
                        value={model.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                    />
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={submitting}
                    >
                        {submitting ? "Prijavljivanje..." : "Prijavi se"}
                    </button>
                </form>
                <div className="text-center mt-3">
                    Nemate nalog? <Link to="/registration">Registrujte se</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;