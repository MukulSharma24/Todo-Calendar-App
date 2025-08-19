"use client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  description?: string;
  status: string;
  scheduledAt?: string;
  duration?: number;
  createdAt: string;
};

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Fetch todos from API and update the state
  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  // Fetch todos once on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Helper: Format date to yyyy-mm-dd (local time)
  const formatDateLocal = (date: Date) =>
    `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,"0")}-${date.getDate().toString().padStart(2,"0")}`;

  // Todos for selected date - using local timezone format
  const todosForSelectedDate = todos.filter(
    (todo) =>
      selectedDate &&
      todo.scheduledAt &&
      formatDateLocal(new Date(todo.scheduledAt)) === formatDateLocal(selectedDate)
  );

  // Handler to delete todo, refetch list after
  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchTodos();
    }
  };

  // Safe date rendering for hydration consistency
  const renderDate = selectedDate
    ? `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
    : "No date selected";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#18181b",
        padding: 32,
        fontFamily: "sans-serif",
        color: "#eee",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "#232339",
          borderRadius: 14,
          padding: 28,
          boxShadow: "0 6px 30px rgba(0,0,0,0.18)",
        }}
      >
        <h1 style={{ fontSize: 30, textAlign: "center", fontWeight: 700 }}>
          Todo List
        </h1>

        <div style={{ margin: "30px auto", maxWidth: "400px" }}>
          <h2
            style={{
              color: "#fff",
              textAlign: "center",
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            Calendar
          </h2>
          <Calendar
            value={selectedDate}
            onChange={(value) => {
              if (value instanceof Date) setSelectedDate(value);
            }}
            locale="en-GB" // fixed locale for hydration consistency
            tileContent={({ date }) => {
              const dateStr = formatDateLocal(date);
              const hasTodo = todos.some(
                (todo) =>
                  todo.scheduledAt &&
                  formatDateLocal(new Date(todo.scheduledAt)) === dateStr
              );
              return hasTodo ? (
                <span
                  style={{
                    display: "block",
                    margin: "0 auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#6c63ff",
                  }}
                />
              ) : null;
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <a
            href="/add-todo"
            style={{
              background: "#6c63ff",
              color: "#fff",
              padding: "8px 22px",
              borderRadius: 7,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Add Todo
          </a>
        </div>

        <h3 style={{ color: "#fff", fontWeight: 500, marginTop: 10 }}>
          {`Todos for ${renderDate}`}
        </h3>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {selectedDate && todosForSelectedDate.length === 0 ? (
            <div style={{ textAlign: "center", color: "#7575a0" }}>
              No todos scheduled for this date.
            </div>
          ) : (
            todosForSelectedDate.map((todo) => (
              <li
                key={todo.id}
                style={{
                  background: "#111119",
                  padding: "14px 18px",
                  borderRadius: 8,
                  marginTop: 12,
                  border: "1px solid #313844",
                  fontSize: 18,
                }}
              >
                <div>
                  <strong>{todo.title}</strong>
                </div>
                <span style={{ color: "#bdbdeb" }}>{todo.description}</span>
                <div style={{ fontSize: 14, marginTop: 4 }}>
                  Status:{" "}
                  <span
                    style={{
                      color:
                        todo.status === "scheduled"
                          ? "#00e96b"
                          : todo.status === "pending"
                          ? "#ffa600"
                          : "#ef475a",
                    }}
                  >
                    {todo.status}
                  </span>
                  {todo.scheduledAt && (
                    <>
                      {" "}
                      | Scheduled:{" "}
                      {new Date(todo.scheduledAt).toLocaleString()}
                      {todo.duration && <> ({todo.duration} min)</>}
                    </>
                  )}
                </div>
                <div style={{ marginTop: 6 }}>
                  <a
                    href={`/edit-todo/${todo.id}`}
                    style={{
                      marginRight: 16,
                      color: "#6c63ff",
                      fontWeight: 500,
                      textDecoration: "underline",
                    }}
                  >
                    Edit
                  </a>
                  <a
                    href={`/schedule`}
                    style={{
                      color: "#30e3ca",
                      fontWeight: 500,
                      textDecoration: "underline",
                    }}
                  >
                    Schedule
                  </a>
                  <button
                    style={{
                      marginLeft: 12,
                      background: "#ef475a",
                      color: "#fff",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: 5,
                      cursor: "pointer",
                    }}
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        <h3 style={{ color: "#fff", fontWeight: 500, marginTop: 24 }}>
          Unscheduled Todos
        </h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos
            .filter((todo) => !todo.scheduledAt)
            .map((todo) => (
              <li
                key={todo.id}
                style={{
                  background: "#111119",
                  padding: "14px 18px",
                  borderRadius: 8,
                  marginTop: 12,
                  border: "1px solid #313844",
                  fontSize: 18,
                }}
              >
                <div>
                  <strong>{todo.title}</strong>
                </div>
                <span style={{ color: "#bdbdeb" }}>{todo.description}</span>
                <div style={{ marginTop: 6 }}>
                  <a
                    href={`/edit-todo/${todo.id}`}
                    style={{
                      marginRight: 16,
                      color: "#6c63ff",
                      fontWeight: 500,
                      textDecoration: "underline",
                    }}
                  >
                    Edit
                  </a>
                  <a
                    href={`/schedule`}
                    style={{
                      color: "#30e3ca",
                      fontWeight: 500,
                      textDecoration: "underline",
                    }}
                  >
                    Schedule
                  </a>
                  <button
                    style={{
                      marginLeft: 12,
                      background: "#ef475a",
                      color: "#fff",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: 5,
                      cursor: "pointer",
                    }}
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </main>
  );
}
