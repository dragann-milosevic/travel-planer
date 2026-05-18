import { useEffect, useState, useCallback, useContext } from "react";
import userService from "../../services/userService/userService";
import { UserRole } from "../../models/User";
import { AuthContext } from "../../context/authContext";
import Modal from "../../components/Modal/Modal";

function AdminPage() {
    const { userId } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    const [confirmDelete, setConfirmDelete] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await userService.getAll();
            // Admin should not see or manage their own account in this list.
            const currentId = userId != null ? String(userId) : null;
            setUsers(data.filter(u => String(u.id) !== currentId));
        } catch {
            setError("Greška prilikom učitavanja korisnika.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => { load(); }, [load]);

    async function handleRoleChange(user, newRole) {
        const result = await userService.updateRole(user.id, newRole);
        if (!result.success) {
            setError(result.error || "Promena uloge nije uspela.");
            return;
        }
        setInfo(`Uloga korisnika ${user.userName} je promijenjena.`);
        load();
    }

    async function handleDelete() {
        if (!confirmDelete) return;
        const result = await userService.remove(confirmDelete.id);
        setConfirmDelete(null);
        if (!result.success) {
            setError(result.error || "Brisanje nije uspelo.");
            return;
        }
        setInfo("Korisnik je obrisan.");
        load();
    }

    return (
        <div className="container py-4">
            <h1 className="mb-4">Administracija korisnika</h1>

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

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                </div>
            )}

            {!loading && (
                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Korisničko ime</th>
                                    <th>Ime i prezime</th>
                                    <th>Email</th>
                                    <th>Uloga</th>
                                    <th className="text-end">Akcije</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.userName}</td>
                                        <td>{u.firstName} {u.lastName}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <select
                                                className="form-select form-select-sm"
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u, e.target.value)}
                                            >
                                                <option value={UserRole.User}>User</option>
                                                <option value={UserRole.Admin}>Admin</option>
                                            </select>
                                        </td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => setConfirmDelete(u)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                title="Potvrda brisanja"
                size="sm"
            >
                <p>
                    Da li ste sigurni da želite obrisati korisnika
                    <strong> {confirmDelete?.userName}</strong>?
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

export default AdminPage;