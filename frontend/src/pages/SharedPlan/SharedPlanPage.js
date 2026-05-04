import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import shareService from "../../services/shareService/shareService";
import { ShareAccessTypeLabel } from "../../models/ShareLink";
import BudgetSummary from "../../components/BudgetSummary/BudgetSummary";
import DestinationCard from "../../components/DestinationCard/DestinationCard";
import ActivityCard from "../../components/ActivityCard/ActivityCard";
import ExpenseCard from "../../components/ExpenseCard/ExpenseCard";

function formatDate(d) {
    if (!d) return "-";
    try { return new Date(d).toLocaleDateString("sr-Latn-RS"); }
    catch { return d; }
}

function SharedPlanPage() {
    const { token } = useParams();
    const [plan, setPlan] = useState(null);
    const [accessType, setAccessType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        async function load() {
            const result = await shareService.openShared(token);
            if (!active) return;
            if (!result.success) {
                setError(result.error || "Link nije validan ili je istekao.");
            } else {
                setPlan(result.plan);
                setAccessType(result.accessType);
            }
            setLoading(false);
        }
        load();
        return () => { active = false; };
    }, [token]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    if (error || !plan) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {error || "Plan nije pronađen."}
                </div>
            </div>
        );
    }

    const sortedDates = [...new Set((plan.activities || []).map(a => a.date))].sort();

    return (
        <div className="container py-4">
            <div className="alert alert-info d-flex align-items-center justify-content-between">
                <div>
                    <i className="bi bi-share me-2"></i>
                    Pregledate dijeljeni plan putovanja
                </div>
                <span className="badge bg-primary">
                    {ShareAccessTypeLabel[accessType] || "Pregled"}
                </span>
            </div>

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
                <DestinationCard key={d.id} destination={d} readOnly />
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
                            <ActivityCard key={a.id} activity={a} readOnly />
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
                <ExpenseCard key={e.id} expense={e} readOnly />
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
                                    checked={!!item.completed}
                                    disabled
                                    readOnly
                                />
                                <span className={item.completed ? "text-decoration-line-through text-muted" : ""}>
                                    {item.text}
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default SharedPlanPage;