// Every function here is one HTTP call to the Express API. No page reload, ever.
async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.status === 204 ? null : res.json();
}

export const api = {
  list: () => request("/todos"),
  create: (title) => request("/todos", { method: "POST", body: JSON.stringify({ title }) }),
  toggle: (id) => request(`/todos/${id}/toggle`, { method: "POST" }),
  remove: (id) => request(`/todos/${id}`, { method: "DELETE" }),
  clearDone: () => request("/todos/done", { method: "DELETE" }),
};
