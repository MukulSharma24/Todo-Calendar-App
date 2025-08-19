"use client";
import { useState } from "react";

export default function SchedulePage() {
  const [id, setId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const scheduledAtIso = new Date(scheduledAt).toISOString();

    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        scheduledAt: scheduledAtIso,
        duration: Number(duration),
      }),
    });
    if (res.ok) {
      setMessage("Todo scheduled successfully!");
      setId("");
      setScheduledAt("");
      setDuration("");
    } else {
      const err = await res.json();
      setMessage(err.error || "Failed to schedule. Please check the info.");
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
        onSubmit={handleSchedule}
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
          Schedule Todo
        </h2>
        <label style={{ fontSize: 16 }}>
          Todo ID:
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
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
            placeholder="Enter Todo ID"
            type="number"
            min="1"
          />
        </label>
        <label style={{ fontSize: 16 }}>
          Scheduled At:
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
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
          Duration (minutes):
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
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
            placeholder="e.g. 60"
            required
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
          Schedule
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
