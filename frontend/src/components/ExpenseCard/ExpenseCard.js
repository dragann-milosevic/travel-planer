import { ExpenseCategoryLabel } from "../../models/Expense";

function formatDate(d) {
    if (!d) return "-";
    try { return new Date(d).toLocaleDateString("sr-Latn-RS"); }
    catch { return d; }
}

function ExpenseCard({ expense, onEdit, onDelete, readOnly = false }) {
    return (
        <div className="card mb-2 shadow-sm">
            <div className="card-body py-2">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2">
                            <strong>{expense.name}</strong>
                            <span className="badge bg-light text-dark">
                                {ExpenseCategoryLabel[expense.category]}
                            </span>
                        </div>
                        <div className="small text-muted">
                            {formatDate(expense.date)}
                            {expense.description && ` · ${expense.description}`}
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold text-primary">
                            {Number(expense.amount).toFixed(2)} €
                        </span>
                        {!readOnly && (
                            <div className="btn-group btn-group-sm">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => onEdit(expense)}
                                    title="Izmeni"
                                >
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => onDelete(expense)}
                                    title="Obriši"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpenseCard;