import { addTodo, toggleTodo } from "./actions";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="container">
      <h1>Ephemeral Test App</h1>
      <p>
        Todo CRUD backed by Postgres &mdash; used to validate PR preview
        environments end to end.
      </p>

      <form action={addTodo} className="add-form">
        <input
          type="text"
          name="title"
          placeholder="What needs doing?"
          required
          maxLength={200}
        />
        <button type="submit">Add</button>
      </form>

      {todos.length === 0 ? (
        <p className="empty">No todos yet. Add one above.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.done ? "done" : ""}>
              <form action={toggleTodo}>
                <input type="hidden" name="id" value={todo.id} />
                <button
                  type="submit"
                  aria-label={todo.done ? "Mark as not done" : "Mark as done"}
                >
                  {todo.done ? "✓" : "○"}
                </button>
              </form>
              <span>{todo.title}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
