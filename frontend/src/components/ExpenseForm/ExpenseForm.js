import { useState } from "react";
import Expense, { ExpenseCategory, ExpenseCategoryLabel } from "../../models/Expense";
import FormField from "../FormField/FormField";

function ExpenseForm({
    initialExpense = null,
    travelPlanId,
    onSubmit,
    onCancel,
    submitting = false
}) {
    const [model, setModel] = useState(
        initialExpense
            ? new Expense(initialExpense)
            : Expense.empty(travelPlanId)
    );
    const [errors, setErrors] = useState({});

    const categoryOptions = Object.values(ExpenseCategory).map(v => ({
        value: v,
        label: ExpenseCategoryLabel[v]
    }));

    function handleChange(e) {
        const { name, value } = e.target;
        setModel(prev => new Expense({ ...prev, [name]: value }));
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
                label="Naziv troška"
                name="name"
                value={model.name}
                onChange={handleChange}
                error={errors.name}
                required
            />
            <div className="row">
                <div className="col-md-6">
                    <FormField
                        label="Kategorija"
                        name="category"
                        type="select"
                        value={model.category}
                        onChange={handleChange}
                        error={errors.category}
                        options={categoryOptions}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <FormField
                        label="Iznos"
                        name="amount"
                        type="number"
                        value={model.amount}
                        onChange={handleChange}
                        error={errors.amount}
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
            </div>
            <FormField
                label="Datum"
                name="date"
                type="date"
                value={model.date}
                onChange={handleChange}
                error={errors.date}
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
                    {submitting ? "Čuvanje..." : (model.id ? "Sačuvaj" : "Dodaj trošak")}
                </button>
            </div>
        </form>
    );
}

export default ExpenseForm;