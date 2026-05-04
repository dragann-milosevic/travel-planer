import { useEffect, useState, useCallback } from "react";
import travelPlanService from "../../services/travelPlanService/travelPlanService";
import TravelPlanCard from "../../components/TravelPlanCard/TravelPlanCard";
import TravelPlanForm from "../../components/TravelPlanForm/TravelPlanForm";
import Modal from "../../components/Modal/Modal";

function HomePage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState(null);

    const loadPlans = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await travelPlanService.getAll();
            setPlans(data);
        } catch (e) {
            setError("Greška prilikom učitavanja planova.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadPlans(); }, [loadPlans]);

    function openCreate() {
        setEditing(null);
        setShowForm(true);
    }

    function openEdit(plan) {
        setEditing(plan);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditing(null);
    }

    async function handleSubmit(plan) {
        setSubmitting(true);
        const result = plan.id
            ? await travelPlanService.update(plan)
            : await travelPlanService.create(plan);
        setSubmitting(false);

        if (!result.success) {
            setError(result.error || "Greška prilikom čuvanja.");
            return;
        }
        setInfo(plan.id ? "Plan je izmijenjen." : "Plan je kreiran.");
        closeForm();
        loadPlans();
    }

    async function handleDelete() {
        if (!confirmDelete) return;
        const result = await travelPlanService.remove(confirmDelete.id);
        setConfirmDelete(null);
        if (!result.success) {
            setError(result.error || "Brisanje nije uspjelo.");
            return;
        }
        setInfo("Plan je obrisan.");
        loadPlans();
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Moji planovi putovanja</h1>
                <button className="btn btn-primary" onClick={openCreate}>
                    <i className="bi bi-plus-lg me-2"></i>Novi plan
                </button>
            </div>

            {error && (
                <div className="alert alert-danger alert-dismissible" role="alert">
                    {error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError("")}
                    ></button>
                </div>
            )}
            {info && (
                <div className="alert alert-success alert-dismissible" role="alert">
                    {info}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setInfo("")}
                    ></button>
                </div>
            )}

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            )}

            {!loading && plans.length === 0 && (
                <div className="text-center py-5 text-muted">
                    <p className="mb-2">Nemate kreiranih planova putovanja.</p>
                    <button className="btn btn-outline-primary" onClick={openCreate}>
                        Kreirajte prvi plan
                    </button>
                </div>
            )}

            {!loading && plans.length > 0 && (
                <div className="row">
                    {plans.map(plan => (
                        <div key={plan.id} className="col-12 col-md-6 col-lg-4">
                            <TravelPlanCard
                                plan={plan}
                                onEdit={openEdit}
                                onDelete={(p) => setConfirmDelete(p)}
                            />
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={showForm}
                onClose={closeForm}
                title={editing ? "Izmijeni plan putovanja" : "Novi plan putovanja"}
                size="lg"
            >
                <TravelPlanForm
                    initialPlan={editing}
                    onSubmit={handleSubmit}
                    onCancel={closeForm}
                    submitting={submitting}
                />
            </Modal>

            <Modal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                title="Potvrda brisanja"
                size="sm"
            >
                <p>
                    Da li ste sigurni da želite obrisati plan
                    <strong> {confirmDelete?.name}</strong>?
                    Sve povezane destinacije, aktivnosti i troškovi će biti obrisani.
                </p>
                <div className="d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setConfirmDelete(null)}
                    >
                        Otkaži
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>
                        Obriši
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default HomePage;