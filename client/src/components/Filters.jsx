const OPTIONS = [
  { value: "all", label: "Toutes" },
  { value: "active", label: "À faire" },
  { value: "done", label: "Faites" },
];

export default function Filters({ value, onChange }) {
  return (
    <nav className="filters" aria-label="Filtre">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          className={o.value === value ? "is-active" : ""}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </nav>
  );
}
