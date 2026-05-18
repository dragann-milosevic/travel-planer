import { ActivityStatus, ActivityStatusLabel } from "../../models/Activity";

function statusBadgeClass(status) {
    switch (Number(status)) {
        case ActivityStatus.Planned: return "bg-secondary";
        case ActivityStatus.Booked: return "bg-info";
        case ActivityStatus.Completed: return "bg-success";
        case ActivityStatus.Cancelled: return "bg-danger";
        default: return "bg-secondary";
    }
}

function formatDate(d) {
    if (!d) return "-";
    try { return new Date(d).toLocaleDateString("sr-Latn-RS"); }
    catch { return d; }
}

function ActivityCard({ activity, onEdit, onDelete, readOnly = false }) {
    return (
        <div className="card mb-2 shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-1">
                            <h6 className="card-title mb-0">{activity.name}</h6>
                            <span className={`badge ${statusBadgeClass(activity.status)}`}>
                                {ActivityStatusLabel[activity.status] || "—"}
                            </span>
                        </div>
                        <div className="small text-muted">
                            <i className="bi bi-calendar3 me-1"></i>
                            {formatDate(activity.date)}
                            {activity.time && (
                                <>
                                    <i className="bi bi-clock ms-3 me-1"></i>
                                    {activity.time}
                                </>
                            )}
                            {activity.location && (
                                <>
                                    <i className="bi bi-geo-alt ms-3 me-1"></i>
                                    {activity.location}
                                </>
                            )}
                        </div>
                        {activity.estimatedCost > 0 && (
                            <div className="small mt-1">
                                <strong>Trošak:</strong> {Number(activity.estimatedCost).toFixed(2)} €
                            </div>
                        )}
                        {activity.description && (
                            <p className="mt-2 mb-0 small">{activity.description}</p>
                        )}
                    </div>
                    {!readOnly && (onEdit || onDelete) && (
                        <div className="btn-group btn-group-sm">
                            {onEdit && (
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => onEdit(activity)}
                                    title="Izmeni"
                                >
                                    <i className="bi bi-pencil"></i>
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => onDelete(activity)}
                                    title="Obriši"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ActivityCard;