// components/ui/Dropdown.jsx
export default function Dropdown({ label, value, options, onChange, ClassName }) {
    return (
        <select
            value={value}
            onChange={onChange}
            className={ClassName}
        >
            <option value="">{label}</option>
            {options.map((opt, index) => (
                <option key={index} value={opt.value || opt}>
                    {opt.label || opt}
                </option>
            ))}
        </select>
    );
}
