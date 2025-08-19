"use client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from "@hello-pangea/dnd";

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
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [newDuration, setNewDuration] = useState<number>(60);

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const formatDateLocal = (date: Date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  const todosForSelectedDate = todos.filter(
    (todo) =>
      selectedDate &&
      todo.scheduledAt &&
      formatDateLocal(new Date(todo.scheduledAt)) === formatDateLocal(selectedDate)
  );

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchTodos();
    }
  };

  const unscheduleTodo = async (id: number) => {
    await fetch("/api/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchTodos();
  };

  const updateDuration = async () => {
    if (editTodoId === null) return;
    await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editTodoId,
        scheduledAt: todos.find((t) => t.id === editTodoId)?.scheduledAt,
        duration: newDuration,
      }),
    });
    setShowDurationModal(false);
    setEditTodoId(null);
    setNewDuration(60);
    await fetchTodos();
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    if (destination.droppableId.startsWith("calendar-")) {
      const droppedDateStr = destination.droppableId.replace("calendar-", "");
      const droppedDateISO = new Date(droppedDateStr).toISOString();

      await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Number(draggableId),
          scheduledAt: droppedDateISO,
          duration: 60,
        }),
      });

      setEditTodoId(Number(draggableId));
      setNewDuration(60);
      setShowDurationModal(true);

      await fetchTodos();
    }
  };

  const renderDate = selectedDate
    ? `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
    : "No date selected";

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
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
                locale="en-GB"
                tileContent={({ date }) => {
                  const dateStr = formatDateLocal(date);
                  const hasTodo = todos.some(
                    (todo) =>
                      todo.scheduledAt &&
                      formatDateLocal(new Date(todo.scheduledAt)) === dateStr
                  );
                  return (
                    <Droppable droppableId={`calendar-${dateStr}`} key={dateStr}>
                      {(provided: DroppableProvided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          {hasTodo && (
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
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  );
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
                        onClick={() => unscheduleTodo(todo.id)}
                      >
                        Undo Schedule
                      </button>
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

            <Droppable droppableId="unscheduled-todos">
              {(provided: DroppableProvided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ listStyle: "none", padding: 0 }}
                >
                  {todos
                    .filter((todo) => !todo.scheduledAt)
                    .map((todo, index) => (
                      <Draggable key={todo.id} draggableId={`${todo.id}`} index={index}>
                        {(provided: DraggableProvided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              background: "#111119",
                              padding: "14px 18px",
                              borderRadius: 8,
                              marginTop: 12,
                              border: "1px solid #313844",
                              fontSize: 18,
                              ...provided.draggableProps.style,
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
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        </main>
      </DragDropContext>

      
      {showDurationModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
          onClick={() => setShowDurationModal(false)}
        >
          <div
            style={{
              background: "#24242b",
              padding: 32,
              borderRadius: 12,
              minWidth: 300,
              color: "#fff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Edit Task Duration (minutes)</h3>
            <input
              type="number"
              min={1}
              value={newDuration}
              onChange={(e) => setNewDuration(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                marginTop: 10,
                borderRadius: 6,
                border: "none",
                outline: "none",
              }}
            />
            <button
              onClick={updateDuration}
              style={{
                marginTop: 20,
                width: "100%",
                padding: "10px",
                background: "#6c63ff",
                color: "#fff",
                fontWeight: "bold",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setShowDurationModal(false)}
              style={{
                marginTop: 10,
                width: "100%",
                padding: "10px",
                background: "#ef475a",
                color: "#fff",
                fontWeight: "bold",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
