import { useEffect, useState } from "react";
import { api } from "./api.js";
import TodoForm from "./components/TodoForm.jsx";
import Filters from "./components/Filters.jsx";
import TodoList from "./components/TodoList.jsx";
import Footer from "./components/Footer.jsx";

// App owns the state. Children receive data and callbacks as props.
export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  // Load once when the component mounts.
  useEffect(() => {
    api.list().then(setTodos).catch((e) => setError(e.message));
  }, []);

  // Each action calls the API, then updates local state with the answer.
  async function run(action) {
    try {
      setError(null);
      await action();
    } catch (e) {
      setError(e.message);
    }
  }

  const add = (title) =>
    run(async () => {
      const todo = await api.create(title);
      setTodos((prev) => [...prev, todo]);
    });

  const toggle = (id) =>
    run(async () => {
      const updated = await api.toggle(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    });

  const remove = (id) =>
    run(async () => {
      await api.remove(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    });

  const clearDone = () =>
    run(async () => {
      await api.clearDone();
      setTodos((prev) => prev.filter((t) => !t.done));
    });

  const visible = todos.filter((t) =>
    filter === "active" ? !t.done : filter === "done" ? t.done : true,
  );
  const remaining = todos.filter((t) => !t.done).length;

  return (
    <main>
      <h1>Todo</h1>
      <TodoForm onAdd={add} />
      <Filters value={filter} onChange={setFilter} />
      {error && <p className="error">Erreur : {error}</p>}
      <TodoList todos={visible} onToggle={toggle} onRemove={remove} />
      <Footer remaining={remaining} onClearDone={clearDone} />
      <p className="meta">
        Page chargée une seule fois. Chaque action est un appel <code>fetch</code> vers
        l'API, et React redessine ce qui change.
      </p>
    </main>
  );
}
