"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTodoPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Clear any previous message
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    if (res.ok) {
      setTitle(""); // clear for good UX
      setDescription("");
      router.push("/"); // Instant redirect => instantly update main list
    } else {
      const err = await res.json();
      setMessage(err.error || "Failed to add todo.");
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
        onSubmit={handleSubmit}
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
          Add Todo
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
            placeholder="Enter title"
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
            placeholder="Optional details"
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
          Add Todo
        </button>
        {message && (
          <div
            style={{
              padding: "8px",
              marginTop: "10px",
              color: "#f76e6e",
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
