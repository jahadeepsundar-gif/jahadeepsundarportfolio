"use client";

import React, { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        padding: "80px 20px",
        textAlign: "center",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F4F2EC",
        color: "#101010",
      }}
    >
      <h2 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "12px" }}>
        Something went wrong!
      </h2>
      <p style={{ color: "#555552", marginBottom: "24px", maxWidth: "500px" }}>
        {error?.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={() => reset()}
        style={{
          background: "#101010",
          color: "#FFFFFF",
          padding: "12px 26px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "0.95rem",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
