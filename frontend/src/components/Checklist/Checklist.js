import { useState } from "react";
import checklistService from "../../services/checklistService/checklistService";
import ChecklistItem from "../../models/ChecklistItem";

function Checklist({ travelPlanId, items, onChange, readOnly = false }) {
    const [newText, setNewText] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleAdd(e) {
        e.preventDefault();
        const text = newText.trim();
        if (!text) {
            setError("Tekst stavke je obavezan.");
            return;
        }
        setError("");
        setSubmitting(true);
        const item = new ChecklistItem({ travelPlanId, text, completed: false });
        const result = await checklistService.create(travelPlanId, item);
        setSubmitting(false);
        if (!result.success) {
            setError(result.error || "Dodavanje nije uspjelo.");
            return;
        }
        setNewText("");
        onChange && onChange();
    }

    async function handleToggle(item) {
        const result = await checklistService.toggle(item);
        if (!result.success) {
            setError(result.error || "Izmjena nije uspjela.");
            return;
        }
        onChange && onChange();
    }

    async function handleDelete(item) {
        const result = await checklistService.remove(travelPlanId, item.id);
        if (!result.success) {
            setError(result.error || "Brisanje nije uspjelo.");
            return;
        }
        onChange && onChange();
    }

    const completedCount = items.filter(i => i.completed).length;

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">Checklist / Packing lista</h5>
                    <span className="badge bg-primary">
                        {completedCount} / {items.length}
                    </span>
                </div>

                {error && (
                    <div className="alert alert-danger alert-dismissible">
                        {error}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setError("")}
                        ></button>
                    </div>
                )}

                {!readOnly && (
                    <form onSubmit={handleAdd} className="d-flex gap-2 mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="npr. Pasoš, karta, punjač..."
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            Dodaj
                        </button>
                    </form>
                )}

                {items.length === 0 && (
                    <p className="text-muted text-center mb-0">Lista je prazna.</p>
                )}

                <ul className="list-group list-group-flush">
                    {items.map(item => (
                        <li
                            key={item.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <div className="form-check flex-grow-1">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`check-${item.id}`}
                                    checked={!!item.completed}
                                    onChange={() => !readOnly && handleToggle(item)}
                                    disabled={readOnly}
                                />
                                <label
                                    htmlFor={`check-${item.id}`}
                                    className={`form-check-label ${item.completed ? "text-decoration-line-through text-muted" : ""}`}
                                >
                                    {item.text}
                                </label>
                            </div>
                            {!readOnly && (
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(item)}
                                    title="Obriši"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Checklist;