import { useState } from "react";
import Activity, { ActivityStatus, ActivityStatusLabel } from "../../models/Activity";
import FormField from "../FormField/FormField";

function ActivityForm({
    initialActivity = null,
    travelPlanId,
    destinations = [],
    planStartDate = null,
    planEndDate = null,
    onSubmit,
    onCancel,
    submitting = false
}) {
    const [model, setModel] = useState(
        initialActivity
            ? new Activity(initialActivity)
            : Activity.empty(travelPlanId)
    );
    const [errors, setErrors] = useState({});

    const statusOptions = Object.values(ActivityStatus).map(v => ({
        value: v,
        label: ActivityStatusLabel[v]
    }));

    const destinationOptions = [
        { value: "", label: "— Bez destinacije —" },
        ...destinations.map(d => ({ value: d.id, label: d.name }))
    ];

    function handleChange(e) {
        const { name, value } = e.target;
        setModel(prev => new Activity({
            ...prev,
            [name]: name === "destinationId" && value === "" ? null : value
        }));
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
                label="Naziv aktivnosti"
                name="name"
                value={model.name}
                onChange={handleChange}
                error={errors.name}
                required
            />
            <div className="row">
                <div className="col-md-6">
                    <FormField
                        label="Datum"
                        name="date"
                        type="date"
                        value={model.date}
                        onChange={handleChange}
                        error={errors.date}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <FormField
                        label="Vreme"
                        name="time"
                        type="time"
                        value={model.time}
                        onChange={handleChange}
                        error={errors.time}
                    />
                </div>
            </div>
            <FormField
                label="Lokacija"
                name="location"
                value={model.location}
                onChange={handleChange}
                error={errors.location}
            />
            {destinations.length > 0 && (
                <FormField
                    label="Destinacija"
                    name="destinationId"
                    type="select"
                    value={model.destinationId ?? ""}
                    onChange={handleChange}
                    error={errors.destinationId}
                    options={destinationOptions}
                />
            )}
            <div className="row">
                <div className="col-md-6">
                    <FormField
                        label="Procenjeni trošak"
                        name="estimatedCost"
                        type="number"
                        value={model.estimatedCost}
                        onChange={handleChange}
                        error={errors.estimatedCost}
                        min="0"
                        step="0.01"
                    />
                </div>
                <div className="col-md-6">
                    <FormField
                        label="Status"
                        name="status"
                        type="select"
                        value={model.status}
                        onChange={handleChange}
                        error={errors.status}
                        options={statusOptions}
                        required
                    />
                </div>
            </div>
            <FormField
                label="Opis"
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
                    {submitting ? "Čuvanje..." : (model.id ? "Sačuvaj" : "Dodaj aktivnost")}
                </button>
            </div>
        </form>
    );
}

export default ActivityForm;