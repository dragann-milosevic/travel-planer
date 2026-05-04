import { useEffect } from "react";
import "./Modal.css";

function Modal({ title, isOpen, onClose, children, size = "md" }) {
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClass = size === "lg" ? "modal-lg" : (size === "sm" ? "modal-sm" : "");

    return (
        <div className="custom-modal-backdrop" onClick={onClose}>
            <div
                className={`modal-dialog ${sizeClass} custom-modal-dialog`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </div>
    );
}

export default Modal;