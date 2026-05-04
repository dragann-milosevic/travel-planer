import { useEffect, useState, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import shareService from "../../services/shareService/shareService";
import { ShareAccessType, ShareAccessTypeLabel } from "../../models/ShareLink";
import "./ShareDialog.css";

function formatDate(d) {
    if (!d) return "-";
    try { return new Date(d).toLocaleString("sr-Latn-RS"); }
    catch { return d; }
}

function ShareDialog({ travelPlanId }) {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [accessType, setAccessType] = useState(ShareAccessType.View);
    const [generating, setGenerating] = useState(false);
    const [activeLink, setActiveLink] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await shareService.getForPlan(travelPlanId);
            setLinks(data);
        } catch {
            setError("Greška prilikom učitavanja linkova.");
        } finally {
            setLoading(false);
        }
    }, [travelPlanId]);

    useEffect(() => { load(); }, [load]);

    async function handleGenerate() {
        setGenerating(true);
        setError("");
        const result = await shareService.create(travelPlanId, accessType);
        setGenerating(false);
        if (!result.success) {
            setError(result.error || "Generisanje linka nije uspjelo.");
            return;
        }
        setActiveLink(result.link);
        load();
    }

    async function handleRevoke(link) {
        const result = await shareService.revoke(travelPlanId, link.id);
        if (!result.success) {
            setError(result.error || "Brisanje linka nije uspjelo.");
            return;
        }
        if (activeLink && activeLink.id === link.id) setActiveLink(null);
        load();
    }

    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }
    }

    return (
        <div>
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

            <div className="card mb-3">
                <div className="card-body">
                    <h6 className="mb-3">Generiši novi link za dijeljenje</h6>
                    <div className="d-flex gap-2 align-items-end">
                        <div className="flex-grow-1">
                            <label className="form-label">Tip pristupa</label>
                            <select
                                className="form-select"
                                value={accessType}
                                onChange={(e) => setAccessType(e.target.value)}
                            >
                                <option value={ShareAccessType.View}>
                                    {ShareAccessTypeLabel[ShareAccessType.View]} (samo pregled)
                                </option>
                                <option value={ShareAccessType.Edit}>
                                    {ShareAccessTypeLabel[ShareAccessType.Edit]} (uređivanje)
                                </option>
                            </select>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={handleGenerate}
                            disabled={generating}
                        >
                            {generating ? "..." : "Generiši"}
                        </button>
                    </div>
                </div>
            </div>

            {activeLink && (
                <div className="card mb-3 border-primary">
                    <div className="card-body text-center">
                        <h6>Novi link je generisan</h6>
                        <div className="qr-container my-3">
                            <QRCodeCanvas
                                value={shareService.buildShareUrl(activeLink.token)}
                                size={180}
                                level="M"
                                includeMargin
                            />
                        </div>
                        <div className="input-group mb-2">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                value={shareService.buildShareUrl(activeLink.token)}
                                readOnly
                            />
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => copyToClipboard(shareService.buildShareUrl(activeLink.token))}
                            >
                                <i className="bi bi-clipboard"></i> Kopiraj
                            </button>
                        </div>
                        <small className="text-muted">
                            Pristup: <strong>{ShareAccessTypeLabel[activeLink.accessType]}</strong>
                        </small>
                    </div>
                </div>
            )}

            <h6>Aktivni linkovi</h6>
            {loading && <p className="text-muted small">Učitavanje...</p>}
            {!loading && links.length === 0 && (
                <p className="text-muted small">Nema aktivnih linkova.</p>
            )}

            <ul className="list-group">
                {links.map(link => (
                    <li
                        key={link.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <span className={`badge ${link.accessType === ShareAccessType.Edit ? "bg-warning text-dark" : "bg-info"}`}>
                                {ShareAccessTypeLabel[link.accessType]}
                            </span>
                            <small className="ms-2 text-muted">
                                Kreiran: {formatDate(link.createdAt)}
                            </small>
                        </div>
                        <div className="btn-group btn-group-sm">
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => setActiveLink(link)}
                            >
                                <i className="bi bi-qr-code"></i>
                            </button>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => copyToClipboard(shareService.buildShareUrl(link.token))}
                                title="Kopiraj link"
                            >
                                <i className="bi bi-clipboard"></i>
                            </button>
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => handleRevoke(link)}
                                title="Opozovi"
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ShareDialog;