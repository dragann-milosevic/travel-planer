function formatDate(d) {
    if (!d) return "-";
    try { return new Date(d).toLocaleDateString("sr-Latn-RS"); }
    catch { return d; }
}

function DestinationCard({ destination, onEdit, onDelete, readOnly = false }) {
    return (
        <div className="card mb-2 shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 className="card-title mb-1">
                            <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                            {destination.name}
                        </h5>
                        <div className="text-muted mb-2">{destination.location}</div>
                        <div className="small">
                            <i className="bi bi-calendar3 me-1"></i>
                            {formatDate(destination.arrivalDate)} – {formatDate(destination.departureDate)}
                        </div>
                        {destination.description && (
                            <p className="mt-2 mb-0">{destination.description}</p>
                        )}
                    </div>
                    {!readOnly && (
                        <div className="btn-group btn-group-sm">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => onEdit(destination)}
                                title="Izmeni"
                            >
                                <i className="bi bi-pencil"></i>
                            </button>
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => onDelete(destination)}
                                title="Obriši"
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DestinationCard;