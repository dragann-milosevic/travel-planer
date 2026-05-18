import { useNavigate } from "react-router-dom";
import "./TravelPlanCard.css";

function formatDate(d) {
    if (!d) return "-";
    try {
        const date = new Date(d);
        return date.toLocaleDateString("sr-Latn-RS");
    } catch { return d; }
}

function TravelPlanCard({ plan, onEdit, onDelete }) {
    const navigate = useNavigate();

    function openDetails() {
        navigate(`/plans/${plan.id}`);
    }

    function handleEdit(e) {
        e.stopPropagation();
        onEdit && onEdit(plan);
    }

    function handleDelete(e) {
        e.stopPropagation();
        onDelete && onDelete(plan);
    }

    return (
        <div className="card travel-plan-card mb-3 shadow-sm" onClick={openDetails}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h4 className="card-title mb-0">{plan.name}</h4>
                    <span className="badge bg-primary">
                        {Number(plan.budget).toFixed(2)} €
                    </span>
                </div>
                {plan.description && (
                    <p className="card-text text-muted mb-2">{plan.description}</p>
                )}
                <div className="mb-2">
                    <i className="bi bi-calendar3 me-2"></i>
                    {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
                </div>
                {plan.destinations && plan.destinations.length > 0 && (
                    <div className="mb-2">
                        <i className="bi bi-geo-alt me-2"></i>
                        {plan.destinations.length} destinacija
                    </div>
                )}
                <div className="d-flex flex-wrap gap-2 mt-3">
                    <button className="btn btn-sm btn-primary" onClick={openDetails}>
                        Detalji
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={handleEdit}>
                        Izmeni
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
                        Obriši
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TravelPlanCard;