import { useEffect, useState, useCallback, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import shareService from "../../services/shareService/shareService";
import sharedEditService from "../../services/sharedEditService/sharedEditService";
import { AuthContext } from "../../context/authContext";
import { ShareAccessType, ShareAccessTypeLabel } from "../../models/ShareLink";
import BudgetSummary from "../../components/BudgetSummary/BudgetSummary";
import DestinationCard from "../../components/DestinationCard/DestinationCard";
import ActivityCard from "../../components/ActivityCard/ActivityCard";
import ExpenseCard from "../../components/ExpenseCard/ExpenseCard";
import DestinationForm from "../../components/DestinationForm/DestinationForm";
import ActivityForm from "../../components/ActivityForm/ActivityForm";
import ExpenseForm from "../../components/ExpenseForm/ExpenseForm";
import Modal from "../../components/Modal/Modal";

function formatDate(d) {
    if (!d) return "-";
    try { return new Date(d).toLocaleDateString("sr-Latn-RS"); }
    catch { return d; }
}

function SharedPlanPage() {
    const { token } = useParams();
    const { token: authToken } = useContext(AuthContext);
    const [plan, setPlan] = useState(null);
    const [accessType, setAccessType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    const [editingDestination, setEditingDestination] = useState(null);
    const [editingActivity, setEditingActivity] = useState(null);
    const [editingExpense, setEditingExpense] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const isLoggedIn = !!authToken;
    // Editing requires BOTH an EDIT token AND a logged-in account on the backend.
    const hasEditToken = accessType === ShareAccessType.Edit;
    const canEdit = hasEditToken && isLoggedIn;
    const needsLoginToEdit = hasEditToken && !isLoggedIn;

    const loadPlan = useCallback(async () => {
        const result = await shareService.openShared(token);
        if (!result.success) {
            setError(result.error || "Link nije validan ili je istekao.");
            setPlan(null);
            return;
        }
        setPlan(result.plan);
        setAccessType(result.accessType);
    }, [token]);

    useEffect(() => {
        let active = true;
        async function load() {
            await loadPlan();
            if (active) setLoading(false);
        }
        load();
        return () => { active = false; };
    }, [loadPlan]);

    async function handleDestinationSubmit(dest) {
        setSubmitting(true);
        const result = await sharedEditService.updateDestination(token, dest);
        setSubmitting(false);
        if (!result.success) {
            setError(result.error || "Greška prilikom čuvanja destinacije.");
            return;
        }
        setEditingDestination(null);
        setInfo("Destinacija je izmenjena.");
        await loadPlan();
    }

    async function handleActivitySubmit(act) {
        setSubmitting(true);
        const result = await sharedEditService.updateActivity(token, act);
        setSubmitting(false);
        if (!result.success) {
            setError(result.error || "Greška prilikom čuvanja aktivnosti.");
            return;
        }
        setEditingActivity(null);
        setInfo("Aktivnost je izmenjena.");
        await loadPlan();
    }

    async function handleExpenseSubmit(exp) {
        setSubmitting(true);
        const result = await sharedEditService.updateExpense(token, exp);
        setSubmitting(false);
        if (!result.success) {
            setError(result.error || "Greška prilikom čuvanja troška.");
            return;
        }
        setEditingExpense(null);
        setInfo("Trošak je izmenjen.");
        await loadPlan();
    }

    async function handleChecklistToggle(item) {
        const result = await sharedEditService.toggleChecklistItem(token, item);
        if (!result.success) {
            setError(result.error || "Izmena nije uspela.");
            return;
        }
        await loadPlan();
    }

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {error || "Plan nije pronađen."}
                </div>
            </div>
        );
    }

    const sortedDates = [...new Set((plan.activities || []).map(a => a.date))].sort();
    const bannerClass = canEdit ? "alert alert-warning" : "alert alert-info";
    const badgeClass = canEdit ? "badge bg-warning text-dark" : "badge bg-primary";
    const bannerIcon = canEdit ? "bi-pencil-square" : "bi-share";

    return (
        <div className="container py-4">
            <div className={`${bannerClass} d-flex align-items-center justify-content-between`}>
                <div>
                    <i className={`bi ${bannerIcon} me-2`}></i>
                    Pregledate deljeni plan putovanja
                </div>
                <span className={badgeClass}>
                    {ShareAccessTypeLabel[accessType] || "Pregled"}
                </span>
            </div>

            {needsLoginToEdit && (
                <div className="alert alert-warning d-flex align-items-center justify-content-between">
                    <div>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Ovaj link omogućava uređivanje, ali morate biti prijavljeni da biste mogli da mijenjate podatke.
                    </div>
                    <Link to="/login" className="btn btn-sm btn-warning">Prijavi se</Link>
                </div>
            )}

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
            {info && (
                <div className="alert alert-success alert-dismissible">
                    {info}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setInfo("")}
                    ></button>
                </div>
            )}

            <h1>{plan.name}</h1>
            <div className="text-muted mb-3">
                {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
            </div>

            {plan.description && (
                <div className="card mb-3 shadow-sm">
                    <div className="card-body">
                        <h5>Opis</h5>
                        <p className="mb-0">{plan.description}</p>
                    </div>
                </div>
            )}

            <BudgetSummary
                budget={plan.budget}
                expenses={plan.expenses || []}
            />

            <h4 className="mt-4">
                Destinacije ({(plan.destinations || []).length})
            </h4>
            {(plan.destinations || []).length === 0 && (
                <p className="text-muted">Nema destinacija.</p>
            )}
            {(plan.destinations || []).map(d => (
                <DestinationCard
                    key={d.id}
                    destination={d}
                    onEdit={canEdit ? (dest) => setEditingDestination(dest) : undefined}
                    readOnly={!canEdit}
                />
            ))}

            <h4 className="mt-4">Aktivnosti</h4>
            {(plan.activities || []).length === 0 && (
                <p className="text-muted">Nema aktivnosti.</p>
            )}
            {sortedDates.map(date => (
                <div key={date} className="mb-3">
                    <h6 className="border-bottom pb-1">{formatDate(date)}</h6>
                    {(plan.activities || [])
                        .filter(a => a.date === date)
                        .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
                        .map(a => (
                            <ActivityCard
                                key={a.id}
                                activity={a}
                                onEdit={canEdit ? (act) => setEditingActivity(act) : undefined}
                                readOnly={!canEdit}
                            />
                        ))}
                </div>
            ))}

            <h4 className="mt-4">
                Troškovi ({(plan.expenses || []).length})
            </h4>
            {(plan.expenses || []).length === 0 && (
                <p className="text-muted">Nema troškova.</p>
            )}
            {(plan.expenses || []).map(e => (
                <ExpenseCard
                    key={e.id}
                    expense={e}
                    onEdit={canEdit ? (exp) => setEditingExpense(exp) : undefined}
                    readOnly={!canEdit}
                />
            ))}

            {(plan.checklistItems || []).length > 0 && (
                <>
                    <h4 className="mt-4">Checklist</h4>
                    <ul className="list-group">
                        {plan.checklistItems.map(item => (
                            <li key={item.id} className="list-group-item">
                                <input
                                    type="checkbox"
                                    className="form-check-input me-2"
                                    id={`shared-check-${item.id}`}
                                    checked={!!item.completed}
                                    onChange={() => canEdit && handleChecklistToggle(item)}
                                    disabled={!canEdit}
                                    readOnly={!canEdit}
                                />
                                <label
                                    htmlFor={`shared-check-${item.id}`}
                                    className={item.completed ? "text-decoration-line-through text-muted" : ""}
                                >
                                    {item.text}
                                </label>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <Modal
                isOpen={!!editingDestination}
                onClose={() => setEditingDestination(null)}
                title="Izmeni destinaciju"
                size="lg"
            >
                {editingDestination && (
                    <DestinationForm
                        initialDestination={editingDestination}
                        travelPlanId={plan.id}
                        planStartDate={plan.startDate}
                        planEndDate={plan.endDate}
                        onSubmit={handleDestinationSubmit}
                        onCancel={() => setEditingDestination(null)}
                        submitting={submitting}
                    />
                )}
            </Modal>

            <Modal
                isOpen={!!editingActivity}
                onClose={() => setEditingActivity(null)}
                title="Izmeni aktivnost"
                size="lg"
            >
                {editingActivity && (
                    <ActivityForm
                        initialActivity={editingActivity}
                        travelPlanId={plan.id}
                        destinations={plan.destinations || []}
                        planStartDate={plan.startDate}
                        planEndDate={plan.endDate}
                        onSubmit={handleActivitySubmit}
                        onCancel={() => setEditingActivity(null)}
                        submitting={submitting}
                    />
                )}
            </Modal>

            <Modal
                isOpen={!!editingExpense}
                onClose={() => setEditingExpense(null)}
                title="Izmeni trošak"
                size="lg"
            >
                {editingExpense && (
                    <ExpenseForm
                        initialExpense={editingExpense}
                        travelPlanId={plan.id}
                        onSubmit={handleExpenseSubmit}
                        onCancel={() => setEditingExpense(null)}
                        submitting={submitting}
                    />
                )}
            </Modal>
        </div>
    );
}

export default SharedPlanPage;