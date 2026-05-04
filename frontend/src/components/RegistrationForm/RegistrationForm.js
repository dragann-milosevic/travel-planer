import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/authService/authService";
import RegistrationModel from "../../models/RegistrationModel";
import FormField from "../FormField/FormField";

function RegistrationForm() {
    const navigate = useNavigate();
    const [model, setModel] = useState(RegistrationModel.empty());
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setModel(prev => new RegistrationModel({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setServerError("");
        setSuccess("");
        const validation = model.validate();
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }
        setSubmitting(true);
        const result = await authService.register(model);
        setSubmitting(false);

        if (!result.ok) {
            setServerError(result.error || "Registracija nije uspjela.");
            return;
        }
        setSuccess("Registracija uspješna. Preusmjeravanje na prijavu...");
        setTimeout(() => navigate("/login"), 1200);
    }

    return (
        <div className="card shadow-sm">
            <div className="card-body p-4">
                <h2 className="text-center mb-4">Registracija</h2>
                {serverError && (
                    <div className="alert alert-danger" role="alert">{serverError}</div>
                )}
                {success && (
                    <div className="alert alert-success" role="alert">{success}</div>
                )}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="row">
                        <div className="col-md-6">
                            <FormField
                                label="Ime"
                                name="firstName"
                                value={model.firstName}
                                onChange={handleChange}
                                error={errors.firstName}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <FormField
                                label="Prezime"
                                name="lastName"
                                value={model.lastName}
                                onChange={handleChange}
                                error={errors.lastName}
                                required
                            />
                        </div>
                    </div>
                    <FormField
                        label="Korisničko ime"
                        name="userName"
                        value={model.userName}
                        onChange={handleChange}
                        error={errors.userName}
                        required
                    />
                    <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value={model.email}
                        onChange={handleChange}
                        error={errors.email}
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
                    <FormField
                        label="Potvrda lozinke"
                        name="confirmPassword"
                        type="password"
                        value={model.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        required
                    />
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={submitting}
                    >
                        {submitting ? "Registrovanje..." : "Registruj se"}
                    </button>
                </form>
                <div className="text-center mt-3">
                    Već imate nalog? <Link to="/login">Prijavite se</Link>
                </div>
            </div>
        </div>
    );
}

export default RegistrationForm;