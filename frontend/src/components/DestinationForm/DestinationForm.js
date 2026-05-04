import { useState } from "react";
import Destination from "../../models/Destination";
import FormField from "../FormField/FormField";

function DestinationForm({
    initialDestination = null,
    travelPlanId,
    planStartDate = null,
    planEndDate = null,
    onSubmit,
    onCancel,
    submitting = false
}) {
    const [model, setModel] = useState(
        initialDestination
            ? new Destination(initialDestination)
            : Destination.empty(travelPlanId)
    );
    const [errors, setErrors] = useState({});

    function handleChange(e) {
        const { name, value } = e.target;
        setModel(prev => new Destination({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const validation = model.validate(planStartDate, planEndDate);
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }
        onSubmit(model);
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <FormField
                label="Naziv destinacije"
                name="name"
                value={model.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="npr. Atina"
                required
            />
            <FormField
                label="Lokacija"
                name="location"
                value={model.location}
                onChange={handleChange}
                error={errors.location}
                placeholder="Grad, država"
                required
            />
            <div className="row">
                <div className="col-md-6">
                    <FormField
                        label="Datum dolaska"
                        name="arrivalDate"
                        type="date"
                        value={model.arrivalDate}
                        onChange={handleChange}
                        error={errors.arrivalDate}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <FormField
                        label="Datum odlaska"
                        name="departureDate"
                        type="date"
                        value={model.departureDate}
                        onChange={handleChange}
                        error={errors.departureDate}
                        required
                    />
                </div>
            </div>
            <FormField
                label="Opis / napomena"
                name="description"
                type="textarea"
                value={model.description}
                onChange={handleChange}
                error={errors.description}
                rows={3}
            />
            <div className="d-flex gap-2 justify-content-end">
                {onCancel && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        Otkaži
                    </button>
                )}
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Čuvanje..." : (model.id ? "Sačuvaj" : "Dodaj destinaciju")}
                </button>
            </div>
        </form>
    );
}

export default DestinationForm;