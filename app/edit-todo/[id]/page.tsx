"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditTodoPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/todos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title || "");
        setDescription(data.description || "");
      });
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    if (res.ok) {
      setMessage("Todo updated!");
      setTimeout(() => router.push("/"), 1200);
    } else {
      setMessage("Failed to update todo.");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#18181b",
      }}
    >
      <form
        onSubmit={handleUpdate}
        style={{
          background: "#24242b",
          padding: 32,
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          minWidth: 340,
          width: "100%",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <h2 style={{ margin: 0, textAlign: "center", color: "#e0e0e0" }}>
          Edit Todo
        </h2>
        <label style={{ fontSize: 16 }}>
          Title:
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              padding: "8px 10px",
              marginTop: 7,
              background: "#18181b",
              color: "#f1f1f1",
              borderRadius: 6,
              border: "1px solid #41414c",
              width: "100%",
              fontSize: 15,
              outline: "none",
              marginBottom: 10,
            }}
          />
        </label>
        <label style={{ fontSize: 16 }}>
          Description:
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              padding: "8px 10px",
              marginTop: 7,
              background: "#18181b",
              color: "#f1f1f1",
              borderRadius: 6,
              border: "1px solid #41414c",
              width: "100%",
              fontSize: 15,
              outline: "none",
              marginBottom: 10,
            }}
          />
        </label>
        <button
          type="submit"
          style={{
            background: "#6c63ff",
            color: "#fff",
            padding: "10px 0",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            marginTop: 12,
          }}
        >
          Update Todo
        </button>
        {message && (
          <div
            style={{
              padding: "8px",
              marginTop: "10px",
              color: "#a1e9af",
              textAlign: "center",
              fontSize: "15px",
            }}
          >
            {message}
          </div>
        )}
      </form>
    </main>
  );
}
