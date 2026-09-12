import { useState } from "react";

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");

  function submit(e) {
    e.preventDefault(); // stop the browser from reloading the page
    const clean = title.trim();
    if (!clean) return;
    onAdd(clean);
    setTitle("");
  }

  return (
    <form className="add" onSubmit={submit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nouvelle tâche…"
        autoFocus
        autoComplete="off"
      />
      <button>Ajouter</button>
    </form>
  );
}
