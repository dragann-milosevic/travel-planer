import { useState } from "react";
import TravelPlan from "../../models/TravelPlan";
import FormField from "../FormField/FormField";

function TravelPlanForm({ initialPlan = null, onSubmit, onCancel, submitting = false }) {
    const [model, setModel] = useState(
        initialPlan ? new TravelPlan(initialPlan) : TravelPlan.empty()
    );
    const [errors, setErrors] = useState({});

    function handleChange(e) {
        const { name, value } = e.target;
        setModel(prev => new TravelPlan({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const validation = model.validate();
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }
        onSubmit(model);
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <FormField
                label="Naziv putovanja"
                name="name"
                value={model.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="npr. Ljetovanje u Grčkoj"
                required
            />
            <FormField
                label="Opis"
                name="description"
                type="textarea"
                value={model.description}
                onChange={handleChange}
                error={errors.description}
                rows={2}
            />
            <div className="row">
                <div className="col-md-6">
                    <FormField
                        label="Početni datum"
                        name="startDate"
                        type="date"
                        value={model.startDate}
                        onChange={handleChange}
                        error={errors.startDate}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <FormField
                        label="Krajnji datum"
                        name="endDate"
                        type="date"
                        value={model.endDate}
                        onChange={handleChange}
                        error={errors.endDate}
                        required
                    />
                </div>
            </div>
            <FormField
                label="Planirani budžet"
                name="budget"
                type="number"
                value={model.budget}
                onChange={handleChange}
                error={errors.budget}
                min="0"
                step="0.01"
                required
            />
            <FormField
                label="Napomene"
                name="notes"
                type="textarea"
                value={model.notes}
                onChange={handleChange}
                error={errors.notes}
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
                    {submitting ? "Čuvanje..." : (model.id ? "Sačuvaj izmjene" : "Kreiraj plan")}
                </button>
            </div>
        </form>
    );
}

export default TravelPlanForm;