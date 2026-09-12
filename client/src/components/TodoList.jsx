import TodoItem from "./TodoItem.jsx";

export default function TodoList({ todos, onToggle, onRemove }) {
  if (todos.length === 0) return <p className="empty">Rien ici.</p>;

  return (
    <ul className="todos">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onRemove={onRemove} />
      ))}
    </ul>
  );
}
