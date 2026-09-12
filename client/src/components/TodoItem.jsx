export default function TodoItem({ todo, onToggle, onRemove }) {
  return (
    <li className={todo.done ? "is-done" : ""}>
      <button
        className="check"
        aria-label={todo.done ? "Marquer à faire" : "Marquer faite"}
        onClick={() => onToggle(todo.id)}
      >
        {todo.done ? "☑" : "☐"}
      </button>
      <span className="title">{todo.title}</span>
      <button className="delete" aria-label="Supprimer" onClick={() => onRemove(todo.id)}>
        ×
      </button>
    </li>
  );
}
