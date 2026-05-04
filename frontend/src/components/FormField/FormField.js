function FormField({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    required = false,
    placeholder = "",
    rows = null,
    options = null,
    min = null,
    step = null,
    disabled = false
}) {
    const inputClass = `form-control ${error ? "is-invalid" : ""}`;
    const selectClass = `form-select ${error ? "is-invalid" : ""}`;

    let control;
    if (type === "textarea") {
        control = (
            <textarea
                className={inputClass}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows || 3}
                required={required}
                disabled={disabled}
            />
        );
    } else if (type === "select") {
        control = (
            <select
                className={selectClass}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                required={required}
                disabled={disabled}
            >
                {options && options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        );
    } else {
        control = (
            <input
                type={type}
                className={inputClass}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                min={min ?? undefined}
                step={step ?? undefined}
                disabled={disabled}
            />
        );
    }

    return (
        <div className="mb-3">
            {label && (
                <label className="form-label">
                    {label}{required && <span className="text-danger"> *</span>}
                </label>
            )}
            {control}
            {error && <div className="invalid-feedback d-block">{error}</div>}
        </div>
    );
}

export default FormField;