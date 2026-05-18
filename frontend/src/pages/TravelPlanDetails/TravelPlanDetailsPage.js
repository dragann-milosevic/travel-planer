import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import travelPlanService from "../../services/travelPlanService/travelPlanService";
import destinationService from "../../services/destinationService/destinationService";
import activityService from "../../services/activityService/activityService";
import expenseService from "../../services/expenseService/expenseService";
import checklistService from "../../services/checklistService/checklistService";

import TravelPlanForm from "../../components/TravelPlanForm/TravelPlanForm";
import DestinationCard from "../../components/DestinationCard/DestinationCard";
import DestinationForm from "../../components/DestinationForm/DestinationForm";
import ActivityCard from "../../components/ActivityCard/ActivityCard";
import ActivityForm from "../../components/ActivityForm/ActivityForm";
import ActivityCalendar from "../../components/ActivityCalendar/ActivityCalendar";
import ExpenseCard from "../../components/ExpenseCard/ExpenseCard";
import ExpenseForm from "../../components/ExpenseForm/ExpenseForm";
import BudgetSummary from "../../components/BudgetSummary/BudgetSummary";
import Checklist from "../../components/Checklist/Checklist";
import ShareDialog from "../../components/ShareDialog/ShareDialog";
import Modal from "../../components/Modal/Modal";

function formatDate(d) {
    if (!d) return "-";
    try { return new Date(d).toLocaleDateString("sr-Latn-RS"); }
    catch { return d; }
}

const TABS = {
    Overview: "overview",
    Destinations: "destinations",
    Activities: "activities",
    Calendar: "calendar",
    Expenses: "expenses",
    Checklist: "checklist",
    Share: "share"
};

function TravelPlanDetailsPage() {
    const { id } = useParams();
    const planId = parseInt(id, 10);
    const navigate = useNavigate();

    const [plan, setPlan] = useState(null);
    const [destinations, setDestinations] = useState([]);
    const [activities, setActivities] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [checklistItems, setChecklistItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    const [tab, setTab] = useState(TABS.Overview);

    useEffect(() => {
        setInfo("");
        setError("");
    }, [tab]);

    const [editingPlan, setEditingPlan] = useState(false);
    const [editingDestination, setEditingDestination] = useState(null);
    const [showDestinationForm, setShowDestinationForm] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [showActivityForm, setShowActivityForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [showShare, setShowShare] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadPlan = useCallback(async () => {
        const data = await travelPlanService.getById(planId);
        if (!data) {
            setError("Plan nije pronađen.");
            return null;
        }
        setPlan(data);
        return data;
    }, [planId]);

    const loadAll = useCallback(async () => {
        setLoading(true);
        try {
            const [p, d, a, e, c] = await Promise.all([
                travelPlanService.getById(planId),
                destinationService.getForPlan(planId),
                activityService.getForPlan(planId),
                expenseService.getForPlan(planId),
                checklistService.getForPlan(planId)
            ]);
            if (!p) {
                setError("Plan nije pronađen.");
            } else {
                setPlan(p);
            }
            setDestinations(d);
            setActivities(a);
            setExpenses(e);
            setChecklistItems(c);
        } catch (err) {
            setError("Greška prilikom učitavanja podataka.");
        } finally {
            setLoading(false);
        }
    }, [planId]);

    useEffect(() => { loadAll(); }, [loadAll]);

    async function handlePlanSubmit(updated) {
        setSubmitting(true);
        const result = await travelPlanService.update(updated);
        setSubmitting(false);
        if (!result.success) {
            setError(result.error || "Greška prilikom čuvanja.");
            return;
        }
        setEditingPlan(false);
        setInfo("Plan je izmenjen.");
        loadPlan();
    }

    async function handleDeletePlan() {
        const result = await travelPlanService.remove(planId);
        if (!result.success) {
            setError(result.error || "Brisanje nije uspelo.");
            return;
        }
        navigate("/");
    }

    async function handleDestinationSubmit(dest) {
        setSubmitting(true);
        const result = dest.id
            ? await destinationService.update(dest)
            : await destinationService.create(planId, dest);
        setSubmitting(false);
        if (!result.success) {
            setError(result.error || "Greška prilikom čuvanja destinacije.");
            return;
        }
        setShowDestinationForm(false);
        setEditingDestination(null);
        setInfo(dest.id ? "Destinacija je izmenjena." : "Destinacija je dodata.");
        const fresh = await destinationService.getForPlan(planId);
        setDestinations(fresh);
    }

    async function deleteDestination(dest) {
        const result = await destinationService.remove(planId, dest.id);
        if (!result.success) {
            setError(result.error || "Brisanje nije uspelo.");
            return;
        }
        setInfo("Destinacija je obrisana.");
        const fresh = await destinationService.getForPlan(planId);
        setDestinations(fresh);
    }

    async function handleActivitySubmit(act) {
        setSubmitting(true);
        const result = act.id
            ? await activityService.update(act)
            : await activityService.create(planId, act);
        setSubmitting(false);
        if (!result.success) {
            setError(result.error || "Greška prilikom čuvanja aktivnosti.");
            return;
        }
        setShowActivityForm(false);
        setEditingActivity(null);
        setInfo(act.id ? "Aktivnost je izmenjena." : "Aktivnost je dodata.");
        const fresh = await activityService.getForPlan(planId);
        setActivities(fresh);
    }

    async function deleteActivity(act) {
        const result = await activityService.remove(planId, act.id);
        if (!result.success) {
            setError(result.error || "Brisanje nije uspelo.");
            return;
        }
        setInfo("Aktivnost je obrisana.");
        const fresh = await activityService.getForPlan(planId);
        setActivities(fresh);
    }

    async function handleExpenseSubmit(exp) {
        setSubmitting(true);
        const result = exp.id
            ? await expenseService.update(exp)
            : await expenseService.create(planId, exp);
        setSubmitting(false);
        if (!result.success) {
            setError(result.error || "Greška prilikom čuvanja troška.");
            return;
        }
        setShowExpenseForm(false);
        setEditingExpense(null);
        setInfo(exp.id ? "Trošak je izmenjen." : "Trošak je dodat.");
        const fresh = await expenseService.getForPlan(planId);
        setExpenses(fresh);
    }

    async function deleteExpense(exp) {
        const result = await expenseService.remove(planId, exp.id);
        if (!result.success) {
            setError(result.error || "Brisanje nije uspelo.");
            return;
        }
        setInfo("Trošak je obrisan.");
        const fresh = await expenseService.getForPlan(planId);
        setExpenses(fresh);
    }

    async function reloadChecklist() {
        const fresh = await checklistService.getForPlan(planId);
        setChecklistItems(fresh);
    }

    const activitiesByDate = activities.reduce((acc, a) => {
        const key = a.date || "—";
        if (!acc[key]) acc[key] = [];
        acc[key].push(a);
        return acc;
    }, {});
    const sortedDates = Object.keys(activitiesByDate).sort();

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
                <button className="btn btn-secondary" onClick={() => navigate("/")}>
                    Nazad
                </button>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                <div>
                    <button
                        className="btn btn-link p-0 mb-2"
                        onClick={() => navigate("/")}
                    >
                        <i className="bi bi-arrow-left me-1"></i>Nazad na listu
                    </button>
                    <h1 className="mb-1">{plan.name}</h1>
                    <div className="text-muted">
                        {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => setShowShare(true)}
                    >
                        <i className="bi bi-share me-1"></i>Podeli
                    </button>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => setEditingPlan(true)}
                    >
                        <i className="bi bi-pencil me-1"></i>Izmeni
                    </button>
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => setConfirmDelete(plan)}
                    >
                        <i className="bi bi-trash me-1"></i>Obriši
                    </button>
                </div>
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

            <ul className="nav nav-tabs mb-3">
                {[
                    { id: TABS.Overview, label: "Pregled", icon: "bi-info-circle" },
                    { id: TABS.Destinations, label: "Destinacije", icon: "bi-geo-alt" },
                    { id: TABS.Activities, label: "Aktivnosti", icon: "bi-list-check" },
                    { id: TABS.Calendar, label: "Kalendar", icon: "bi-calendar3" },
                    { id: TABS.Expenses, label: "Troškovi", icon: "bi-cash-coin" },
                    { id: TABS.Checklist, label: "Checklist", icon: "bi-check2-square" }
                ].map(t => (
                    <li key={t.id} className="nav-item">
                        <button
                            className={`nav-link ${tab === t.id ? "active" : ""}`}
                            onClick={() => setTab(t.id)}
                        >
                            <i className={`bi ${t.icon} me-2`}></i>{t.label}
                        </button>
                    </li>
                ))}
            </ul>

            {tab === TABS.Overview && (
                <div>
                    <BudgetSummary budget={plan.budget} expenses={expenses} />
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card mb-3 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Osnovne informacije</h5>
                                    {plan.description && (
                                        <p className="text-muted">{plan.description}</p>
                                    )}
                                    {plan.notes && (
                                        <>
                                            <h6 className="mt-3">Napomene</h6>
                                            <p className="mb-0">{plan.notes}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card mb-3 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Brzi pregled</h5>
                                    <ul className="list-unstyled mb-0">
                                        <li><strong>Destinacija:</strong> {destinations.length}</li>
                                        <li><strong>Aktivnosti:</strong> {activities.length}</li>
                                        <li><strong>Troškovi:</strong> {expenses.length}</li>
                                        <li>
                                            <strong>Checklist:</strong>{" "}
                                            {checklistItems.filter(i => i.completed).length} / {checklistItems.length}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {tab === TABS.Destinations && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">Destinacije ({destinations.length})</h4>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setEditingDestination(null);
                                setShowDestinationForm(true);
                            }}
                        >
                            <i className="bi bi-plus-lg me-1"></i>Nova destinacija
                        </button>
                    </div>
                    {destinations.length === 0 && (
                        <p className="text-muted">Nema dodatih destinacija.</p>
                    )}
                    {destinations.map(d => (
                        <DestinationCard
                            key={d.id}
                            destination={d}
                            onEdit={(dest) => {
                                setEditingDestination(dest);
                                setShowDestinationForm(true);
                            }}
                            onDelete={(dest) => setConfirmDelete({ type: "destination", item: dest })}
                        />
                    ))}
                </div>
            )}

            {tab === TABS.Activities && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">Aktivnosti po danima</h4>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setEditingActivity(null);
                                setShowActivityForm(true);
                            }}
                        >
                            <i className="bi bi-plus-lg me-1"></i>Nova aktivnost
                        </button>
                    </div>
                    {activities.length === 0 && (
                        <p className="text-muted">Nema dodatih aktivnosti.</p>
                    )}
                    {sortedDates.map(date => (
                        <div key={date} className="mb-3">
                            <h5 className="border-bottom pb-1">
                                <i className="bi bi-calendar3 me-2"></i>
                                {formatDate(date)}
                            </h5>
                            {activitiesByDate[date]
                                .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
                                .map(a => (
                                <ActivityCard
                                    key={a.id}
                                    activity={a}
                                    onEdit={(act) => {
                                        setEditingActivity(act);
                                        setShowActivityForm(true);
                                    }}
                                    onDelete={(act) => setConfirmDelete({ type: "activity", item: act })}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {tab === TABS.Calendar && (
                <div>
                    <h4 className="mb-3">Kalendarski pregled</h4>
                    <ActivityCalendar
                        activities={activities}
                        defaultDate={plan.startDate ? new Date(plan.startDate) : null}
                        onSelectActivity={(act) => {
                            setEditingActivity(act);
                            setShowActivityForm(true);
                        }}
                    />
                </div>
            )}

            {tab === TABS.Expenses && (
                <div>
                    <BudgetSummary budget={plan.budget} expenses={expenses} />
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">Troškovi ({expenses.length})</h4>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setEditingExpense(null);
                                setShowExpenseForm(true);
                            }}
                        >
                            <i className="bi bi-plus-lg me-1"></i>Novi trošak
                        </button>
                    </div>
                    {expenses.length === 0 && (
                        <p className="text-muted">Nema evidentiranih troškova.</p>
                    )}
                    {expenses
                        .slice()
                        .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
                        .map(e => (
                        <ExpenseCard
                            key={e.id}
                            expense={e}
                            onEdit={(exp) => {
                                setEditingExpense(exp);
                                setShowExpenseForm(true);
                            }}
                            onDelete={(exp) => setConfirmDelete({ type: "expense", item: exp })}
                        />
                    ))}
                </div>
            )}

            {tab === TABS.Checklist && (
                <Checklist
                    travelPlanId={planId}
                    items={checklistItems}
                    onChange={reloadChecklist}
                />
            )}

            <Modal
                isOpen={editingPlan}
                onClose={() => setEditingPlan(false)}
                title="Izmeni plan putovanja"
                size="lg"
            >
                <TravelPlanForm
                    initialPlan={plan}
                    onSubmit={handlePlanSubmit}
                    onCancel={() => setEditingPlan(false)}
                    submitting={submitting}
                />
            </Modal>

            <Modal
                isOpen={showDestinationForm}
                onClose={() => {
                    setShowDestinationForm(false);
                    setEditingDestination(null);
                }}
                title={editingDestination ? "Izmeni destinaciju" : "Nova destinacija"}
                size="lg"
            >
                <DestinationForm
                    initialDestination={editingDestination}
                    travelPlanId={planId}
                    planStartDate={plan.startDate}
                    planEndDate={plan.endDate}
                    onSubmit={handleDestinationSubmit}
                    onCancel={() => {
                        setShowDestinationForm(false);
                        setEditingDestination(null);
                    }}
                    submitting={submitting}
                />
            </Modal>

            <Modal
                isOpen={showActivityForm}
                onClose={() => {
                    setShowActivityForm(false);
                    setEditingActivity(null);
                }}
                title={editingActivity ? "Izmeni aktivnost" : "Nova aktivnost"}
                size="lg"
            >
                <ActivityForm
                    initialActivity={editingActivity}
                    travelPlanId={planId}
                    destinations={destinations}
                    planStartDate={plan.startDate}
                    planEndDate={plan.endDate}
                    onSubmit={handleActivitySubmit}
                    onCancel={() => {
                        setShowActivityForm(false);
                        setEditingActivity(null);
                    }}
                    submitting={submitting}
                />
            </Modal>

            <Modal
                isOpen={showExpenseForm}
                onClose={() => {
                    setShowExpenseForm(false);
                    setEditingExpense(null);
                }}
                title={editingExpense ? "Izmeni trošak" : "Novi trošak"}
                size="lg"
            >
                <ExpenseForm
                    initialExpense={editingExpense}
                    travelPlanId={planId}
                    onSubmit={handleExpenseSubmit}
                    onCancel={() => {
                        setShowExpenseForm(false);
                        setEditingExpense(null);
                    }}
                    submitting={submitting}
                />
            </Modal>

            <Modal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                title="Deljenje plana"
                size="lg"
            >
                <ShareDialog travelPlanId={planId} />
            </Modal>

            <Modal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                title="Potvrda brisanja"
                size="sm"
            >
                <p>Da li ste sigurni da želite obrisati?</p>
                <div className="d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setConfirmDelete(null)}
                    >
                        Otkaži
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => {
                            if (!confirmDelete) return;
                            const cd = confirmDelete;
                            setConfirmDelete(null);
                            if (cd.type === "destination") deleteDestination(cd.item);
                            else if (cd.type === "activity") deleteActivity(cd.item);
                            else if (cd.type === "expense") deleteExpense(cd.item);
                            else handleDeletePlan();
                        }}
                    >
                        Obriši
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default TravelPlanDetailsPage;